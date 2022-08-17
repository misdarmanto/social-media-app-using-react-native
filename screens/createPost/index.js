import React, { useLayoutEffect, useState } from "react";
import {
  TextArea,
  Button,
  VStack,
  HStack,
  Text,
  ScrollView,
  IconButton,
  Box,
} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { uploadImage } from "../../lib/functions/uploadImage";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";

export default function CreatePost() {
  const { currentUserData } = useContextApi();
  const { imageUri } = useRoute().params;

  const [textAreaValue, setTextAreaValue] = useState("");
  const [images, setImages] = useState(imageUri);

  const navigation = useNavigation();

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
      };
      const userCollectionsRef = doc(collection(db, "Post"));
      await setDoc(userCollectionsRef, data);
    } catch (e) {
      console.error(e);
    }
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
      <ScrollView>
        <TextArea
          my={5}
          style={{ minHeight: 100 }}
          value={textAreaValue}
          onChangeText={handleTextArea}
          placeholder="Apa yang kamu pikirkan?"
          placeholderTextColor={"gray.500"}
          bgColor={"#FFF"}
          fontSize="md"
          borderColor={"#FFF"}
          _focus={{ borderColor: "#FFF" }}
          autoFocus
        />
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
          onPress={handlPickImageFromLocalStorage}
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
          onPress={handlPickImageFromLocalStorage}
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
      </HStack>
    </VStack>
  );
}
