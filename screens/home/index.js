import React, { useEffect, useLayoutEffect, useState, useRef } from "react";

import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Stack,
  Text,
  VStack,
} from "native-base";
import Card from "../../components/Card";
import { FlatList, TouchableOpacity, AppState } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import SkeletonCard from "./components/SkeletonCard";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { getPost } from "../../lib/functions/getPost";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import * as ImagePicker from "expo-image-picker";
import { getRandomColor } from "../../lib/functions/getRandomColor";
import TextTitleStyle from "../../components/TextTitleStyle";

export default function Home() {
  const {
    currentUserData,
    postCollection,
    setPostCollection,
    usersCollection,
  } = useContextApi();
  const navigation = useNavigation();

  const [isDataAvaliable, setIsDataAvaliable] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    appState.current = nextAppState;
    const docRef = doc(db, "Users", currentUserData.userID);

    if (appState.current === "active") {
      await updateDoc(docRef, {
        isOnline: true,
      });
    } else {
      await updateDoc(docRef, {
        isOnline: false,
      });
    }
  };

  useEffect(() => {
    if (currentUserData.followers <= 5 || currentUserData.following <= 5) {
      navigation.navigate("FriendsSuggestion");
    }
  }, []);

  const handlPickImageFromLocalStorage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 1,
    });

    if (result.cancelled) return;

    if (result.type !== "image") {
      alert("file not support");
      return;
    }

    if (result.base64.length > 4371340) {
      alert("maximum size 2MB");
      return;
    }
    return result;
  };

  const handleOnRefresh = () => {
    setIsDataAvaliable(false);
    setIsRefresh(true);
    getPost()
      .then((data) => setPostCollection(data))
      .then(() => {
        setIsDataAvaliable(true);
        setIsRefresh(false);
      });
  };

  useEffect(() => {
    if (postCollection.length === 0) return;
    setIsDataAvaliable(true);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <HStack alignItems="center">
          <IconButton
            variant="ghost"
            borderRadius="full"
            _pressed={{ bg: "gray.100" }}
            _icon={{
              as: FontAwesome5,
              name: "feather-alt",
              size: "xl",
              color: "darkBlue.500",
            }}
          />
          <Text
            color="darkBlue.500"
            style={{ fontSize: 18, fontFamily: "myFont" }}
          >
            Ndopok Club
          </Text>
        </HStack>
      ),
      headerRight: () => (
        <HStack space={2} px={5} alignItems="center">
          <IconButton
            onPress={() => navigation.navigate("Search")}
            variant="ghost"
            borderRadius="full"
            bg={"darkBlue.50"}
            _pressed={{ bg: "gray.50" }}
            _icon={{
              as: FontAwesome,
              name: "search",
              size: "md",
              color: "darkBlue.500",
            }}
          />

          <Box>
            {Array.isArray(currentUserData.notifications) &&
              currentUserData.notifications.length !== 0 && (
                <Badge
                  colorScheme="danger"
                  rounded="full"
                  mb={-5}
                  mr={0}
                  zIndex={1}
                  variant="solid"
                  alignSelf="flex-end"
                  _text={{
                    fontSize: 7,
                  }}
                >
                  {currentUserData.notifications.length}
                </Badge>
              )}
            <IconButton
              onPress={() => navigation.navigate("Notifications")}
              variant="ghost"
              borderRadius="full"
              bg={"darkBlue.50"}
              _pressed={{ bg: "gray.50" }}
              _icon={{
                as: Ionicons,
                name: "notifications",
                size: "md",
                color: "darkBlue.500",
              }}
            />
          </Box>
        </HStack>
      ),
    });
  }, [currentUserData]);

  const HeaderStyle = () => {
    const listFollowUserSuggesion = usersCollection.filter((data) => {
      return data.userID !== currentUserData.userID;
    });

    return (
      <VStack minHeight={20} bg="#FFF">
        <Stack
          direction="row"
          alignItems="center"
          space={2}
          px={"3"}
          py="3"
          justifyContent="space-between"
        >
          <IconButton
            onPress={async () => {
              const imageUri = await handlPickImageFromLocalStorage();
              navigation.navigate("CreatePost", { imageUri: imageUri });
            }}
            variant="ghost"
            borderRadius="full"
            bg={"darkBlue.50"}
            _pressed={{ bg: "gray.50" }}
            _icon={{
              as: MaterialIcons,
              name: "image",
              size: "xl",
              color: "darkBlue.500",
            }}
          />

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CreatePost", { imageUri: null })
            }
          >
            <Box h={10} w="xs" bg="gray.100" rounded="full" p={2} px={5}>
              <Text color="gray.500">Apa yang kamu pikirkan?</Text>
            </Box>
          </TouchableOpacity>
        </Stack>

        <FlatList
          horizontal
          data={listFollowUserSuggesion}
          keyExtractor={(item) => item.userID}
          style={{
            borderColor: "#e3e3e3",
            borderBottomWidth: 1,
            borderTopWidth: 1,
            paddingVertical: 10,
          }}
          renderItem={({ item }) => (
            <VStack
              alignItems="center"
              justifyContent="center"
              w="32"
              h="40"
              mx="2"
              space={2}
              borderWidth={"1"}
              borderColor="gray.200"
              borderRadius="md"
            >
              <Avatar
                bg={getRandomColor(item.userName[0])}
                source={{ uri: item.userProfile }}
              >
                {item.userName[0]}
                {item.isOnline && <Avatar.Badge bg="green.500" />}
              </Avatar>
              <Text style={{ fontFamily: "myFont" }}>{item.userName} </Text>

              <Button
                bgColor="darkBlue.500"
                size="xs"
                _pressed={{ bgColor: "darkBlue.300" }}
                width={"24"}
              >
                Follow
              </Button>
            </VStack>
          )}
        />
      </VStack>
    );
  };

  return isDataAvaliable ? (
    <FlatList
      ListHeaderComponent={() => <HeaderStyle />}
      data={postCollection}
      keyExtractor={(item) => item.postID}
      renderItem={({ item }) => (
        <Card
          data={item}
          avatarOnPress={() => {
            if (currentUserData.userID === item.userID) {
              navigation.navigate("MyProfile");
            } else {
              navigation.navigate("DetailProfile", {
                userTargetID: item.userID,
              });
            }
          }}
        />
      )}
      refreshing={isRefresh}
      onRefresh={handleOnRefresh}
    />
  ) : (
    <Box flex={1} bgColor="#FFF">
      {[1, 2, 3, 4, 5].map((data) => (
        <SkeletonCard key={data} />
      ))}
    </Box>
  );
}
