import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  TextArea,
  Button,
  VStack,
  HStack,
  ScrollView,
  IconButton,
  Box,
} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { Image } from "react-native";


import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { uploadImage } from "../../lib/functions/uploadImage";
import * as ImagePicker from "expo-image-picker";

export default function EditPost() {
  const [textAreaValue, setTextAreaValue] = useState("");
  const [image, setImage] = useState(null);

  const navigation = useNavigation();
  const { postData } = useRoute().params;

  useEffect(() => {
    setTextAreaValue(postData.text);
    setImage(postData.image);
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

    if (result.type !== "Images") {
      alert("file not support");
      return;
    }

    if (result.base64.length > 4371340) {
      alert("maximum size 2MB");
      return;
    }
    setImage(result);
  };

  const updatePost = async () => {
    const imageUploaded = image ? await uploadImage(image.uri) : null;
    try {
      const userCollectionsRef = doc(db, "Post", postData.docPostID);
      await updateDoc(userCollectionsRef, {
        text: textAreaValue,
      });
      await updateDoc(userCollectionsRef, {
        image: imageUploaded,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    if (textAreaValue === "" && Array.isArray(image)) {
      alert("can't empty");
      return;
    }
    await updatePost();
    setImage(null);
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
          isDisabled={textAreaValue === "" && image === null}
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
  }, [textAreaValue, image]);

  return (
    <VStack flex={1} justifyContent="space-between" bgColor={"#FFF"} p={1}>
      <ScrollView>
        <TextArea
          my={5}
          value={textAreaValue}
          onChangeText={handleTextArea}
          placeholder="Apa yang kamu pikirkan?"
          placeholderTextColor={"gray.500"}
          bgColor={"#FFF"}
          fontSize="md"
          borderColor={"#FFF"}
          _focus={{ borderColor: "#FFF" }}
          autoFocus={true}
        />
        {image && (
          <Box>
            <IconButton
              position="absolute"
              top={0}
              right={0}
              zIndex={1}
              onPress={() => setImage(null)}
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
              source={{ uri: image.imageUri }}
              style={{ height: 500, borderRadius: 10 }}
            />
          </Box>
        )}
      </ScrollView>
      <HStack space={3}>
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
