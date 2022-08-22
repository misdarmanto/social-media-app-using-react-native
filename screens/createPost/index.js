import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  VStack,
  HStack,
  Text,
  ScrollView,
  IconButton,
  Box,
  Actionsheet,
  Avatar,
  Input,
  Icon,
  Stack,
} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
  Octicons,
} from "@expo/vector-icons";
import { Image, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { uploadImage } from "../../lib/functions/uploadImage";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import { getRandomColor } from "../../lib/functions/getRandomColor";

export default function CreatePost() {
  const { currentUserData, allUserNameTags, usersCollection } = useContextApi();
  const { imageUri } = useRoute().params;
  const [textAreaValue, setTextAreaValue] = useState("");
  const [images, setImages] = useState(imageUri);
  const [showModal, setShowModal] = useState(false);
  const [listUserInfo, setListUserInfo] = useState([]);
  const [tags, setTags] = useState([]);

  const navigation = useNavigation();

  const getUserInfo = usersCollection.map((user) => {
    return {
      tag: user.userName,
      name: user.name,
      userID: user.userID,
      userProfile: user.userProfile,
      isOnline: user.isOnline,
    };
  });

  useEffect(() => {
    setListUserInfo(getUserInfo);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Post",
    });
  }, []);

  const handleTextArea = (value) => {
    setTextAreaValue(value);
  };

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
    setImages(result);
  };

  const handleSearchTag = (value) => {
    const searchTag = getUserInfo.filter((user) => {
      if (user.tag.toUpperCase().search(value.toUpperCase()) !== -1)
        return user;
    });
    setListUserInfo(searchTag);
  };

  const createPost = async () => {
    const imageUploaded = images ? await uploadImage(images.uri) : null;
    try {
      const data = {
        userID: currentUserData.userID,
        text: textAreaValue,
        image: imageUploaded,
        likes: [],
        comments: [],
        upVote: [],
        createdAt: Timestamp.now(),
        postID: uuid.v4(),
        tags: tags,
        hashTags: [],
      };
      const userCollectionsRef = doc(collection(db, "Post"));
      await setDoc(userCollectionsRef, data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = async () => {
    if (textAreaValue === "" && Array.isArray(images)) {
      alert("can't empty");
      return;
    }
    await createPost();
    setImages(null);
    setTextAreaValue(null);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerShadowVisible: false,
      headerLeft: () => (
        <IconButton
          onPress={() => navigation.goBack()}
          variant="ghost"
          borderRadius="full"
          _pressed={{ bg: "gray.50" }}
          _icon={{
            as: Ionicons,
            name: "md-close",
            size: "2xl",
            color: "gray.400",
          }}
        />
      ),

      headerRight: () => (
        <Button
          variant="ghost"
          isDisabled={textAreaValue === "" && images === null}
          onPress={() => {
            handleSubmit();
            navigation.navigate("Home");
          }}
          _text={{ color: "darkBlue.500", fontSize: "xl" }}
        >
          Posting
        </Button>
      ),
    });
  }, [textAreaValue, images]);

  return (
    <VStack flex={1} justifyContent="space-between" bgColor={"#FFF"} p={1}>
      <ScrollView px={"5"}>
        <TextInput
          value={textAreaValue}
          style={{
            fontSize: 16,
            marginTop: 5,
            letterSpacing: 0.5,
            color: "gray",
          }}
          editable={true}
          multiline={true}
          onChangeText={handleTextArea}
          placeholder="Apa yang kamu pikirkan?"
          placeholderTextColor="gray"
          autoFocus={true}
        />
        <HStack flexWrap="wrap" space={2}>
          {tags.map((value, index) => (
            <TouchableOpacity key={index}>
              <Text color="darkBlue.500">{value.tag}</Text>
            </TouchableOpacity>
          ))}
        </HStack>
        {images && (
          <Box>
            <IconButton
              position="absolute"
              top={0}
              right={0}
              zIndex={1}
              onPress={() => setImages(null)}
              variant="ghost"
              borderRadius="full"
              _pressed={{ bg: "gray.50" }}
              _icon={{
                as: Ionicons,
                name: "md-close",
                size: "xl",
                color: "gray.400",
              }}
            />
            <Image
              source={{ uri: images.uri }}
              style={{ height: 500, borderRadius: 10 }}
            />
          </Box>
        )}
      </ScrollView>
      <HStack space={3} borderTopWidth="1" borderTopColor="gray.200">
        <IconButton
          onPress={handlPickImageFromLocalStorage}
          variant="ghost"
          borderRadius="full"
          _pressed={{ bg: "gray.50" }}
          _icon={{
            as: MaterialIcons,
            name: "image",
            size: "2xl",
            color: "darkBlue.400",
          }}
        />
        <IconButton
          variant="ghost"
          borderRadius="full"
          _pressed={{ bg: "gray.50" }}
          _icon={{
            as: MaterialCommunityIcons,
            name: "file-gif-box",
            size: "2xl",
            color: "darkBlue.400",
          }}
        />

        <IconButton
          onPress={handleModal}
          variant="ghost"
          borderRadius="full"
          _pressed={{ bg: "gray.50" }}
          _icon={{
            as: Feather,
            name: "at-sign",
            size: "2xl",
            color: "darkBlue.400",
          }}
        />

        <IconButton
          onPress={handleModal}
          variant="ghost"
          borderRadius="full"
          _pressed={{ bg: "gray.50" }}
          _icon={{
            as: Octicons,
            name: "hash",
            size: "2xl",
            color: "darkBlue.400",
          }}
        />
      </HStack>

      <Actionsheet isOpen={showModal} onClose={handleModal}>
        <Actionsheet.Content minH="2xl">
          <Box justifyContent="center">
            <Input
              w={"100%"}
              mb="5"
              borderRadius="full"
              onChangeText={handleSearchTag}
              InputLeftElement={
                <Icon
                  as={<FontAwesome name="search" size={30} color="black" />}
                  size={8}
                  ml="5"
                  color="muted.400"
                />
              }
              placeholder="Cari..."
              _focus={{ bgColor: "gray.50", borderColor: "gray.300" }}
            />
          </Box>
          {listUserInfo.map((user, index) => (
            <Actionsheet.Item
              key={index}
              onPress={() => {
                handleModal();
                if (tags.includes(user.tag)) return;
                setTags([...tags, { tag: user.tag, userID: user.userID }]);
              }}
            >
              <HStack space={2}>
                <Avatar
                  bg={getRandomColor(user.name[0])}
                  source={{ uri: user.userProfile }}
                >
                  {user.name[0]}
                  {user.isOnline && <Avatar.Badge bg="green.500" />}
                </Avatar>
                <VStack>
                  <Text fontFamily="myFont">{user.name}</Text>
                  <Text color="gray.500">{user.tag}</Text>
                </VStack>
              </HStack>
            </Actionsheet.Item>
          ))}
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  );
}
