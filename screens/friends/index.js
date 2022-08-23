import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Text,
  Avatar,
  HStack,
  Box,
  IconButton,
  VStack,
} from "native-base";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { FlatList, TouchableOpacity } from "react-native";
import { getRandomColor } from "../../lib/functions/getRandomColor";
import { sendNotification } from "../../lib/functions/handleNotification";
import { Timestamp } from "firebase/firestore";
import uuid from "react-native-uuid";
import {
  handleFollowUser,
  handleUnfollowUser,
} from "../../lib/functions/handleFollowAndUnfollow";

const Friends = () => {
  const { usersCollection, currentUserData } = useContextApi();
  const navigation = useNavigation();

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const users = usersCollection.filter((data) => {
      return data.userID !== currentUserData.userID;
    });
    setUserList(users);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          onPress={() => navigation.navigate("Search")}
          variant="ghost"
          borderRadius="full"
          bg={"darkBlue.50"}
          mr="3"
          _pressed={{ bg: "gray.50" }}
          _icon={{
            as: FontAwesome,
            name: "search",
            size: "md",
            color: "darkBlue.500",
          }}
        />
      ),
    });
  }, []);

  return (
    <Box flex={1} bgColor="lightText">
      <FlatList
        data={userList}
        keyExtractor={(item) => item.userID}
        renderItem={({ item }) => <RenderItem item={item} />}
      />
    </Box>
  );
};

const RenderItem = ({ item }) => {
  const { currentUserData } = useContextApi();
  const navigation = useNavigation();

  const [isAlreadyFollow, setIsAlreadyFollow] = useState(false);

  useEffect(() => {
    const isFollowing = currentUserData.following.includes(item.userID);
    setIsAlreadyFollow(isFollowing);
  }, []);

  const handleFollow = (ID) => {
    handleFollowUser({
      currentUserID: currentUserData.userID,
      userTargetID: ID,
    });
    setIsAlreadyFollow(false);
  };

  const handleUnfollow = (ID) => {
    handleUnfollowUser({
      currentUserID: currentUserData.userID,
      userTargetID: ID,
    });
    setIsAlreadyFollow(true);
  };

  const handleSendNotification = (docID, userID) => {
    const newData = {
      userID: userID,
      message: `telah mengikuti kamu`,
      createdAt: Timestamp.now(),
      notificationID: uuid.v4(),
    };
    sendNotification(docID, newData);
  };

  return (
    <HStack px="2" my="2" justifyContent="space-between" alignItems="center">
      <HStack space={5} alignItems="center">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("DetailProfile", { userTargetID: item.userID })
          }
        >
          <Avatar
            bg={getRandomColor(item.name[0])}
            source={{
              uri: item.userProfile,
            }}
          >
            {item.name[0]}
          </Avatar>
        </TouchableOpacity>

        <VStack>
          <HStack alignItems="center" space="1">
            <Text fontSize="md" fontFamily="myFont">
              {item.name}
            </Text>
            {item.isVerified && (
              <MaterialIcons name="verified" size={18} color="dodgerblue" />
            )}
          </HStack>
          <Text color="gray.500">{item.userName}</Text>
        </VStack>
      </HStack>
      <Button
        onPress={() => {
          if (isAlreadyFollow) {
            handleFollow(item.userID);
            handleSendNotification(item.userID, item.userID);
          } else {
            handleUnfollow(item.userID);
          }
        }}
        bgColor={isAlreadyFollow ? "gray.200" : "darkBlue.500"}
        size="xs"
        _pressed={{ bgColor: "darkBlue.400" }}
        width="32"
        borderRadius="full"
        startIcon={
          <Ionicons
            name="person-add"
            size={15}
            color={isAlreadyFollow ? "gray" : "#FFF"}
          />
        }
        _text={{
          fontSize: "xs",
          color: isAlreadyFollow ? "gray.500" : "lightText",
        }}
      >
        {isAlreadyFollow ? "Unfollow" : "Follow"}
      </Button>
    </HStack>
  );
};

export default Friends;
