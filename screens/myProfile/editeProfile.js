import {
  Box,
  Avatar,
  Input,
  VStack,
  IconButton,
  Button,
  Text,
} from "native-base";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import { getRandomColor } from "../../lib/functions/getRandomColor";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { uploadImage } from "../../lib/functions/uploadImage";
import * as ImagePicker from "expo-image-picker";

const EditeProfile = () => {
  const { currentUserData } = useContextApi();
  const navigation = useNavigation();

  const [userProfile, setUserProfile] = useState(currentUserData.userProfile);
  const [name, setName] = useState(currentUserData.name);
  const [bio, setBio] = useState(currentUserData.bio);

  const handleOnChangeTextname = (text) => {
    setName(text);
  };

  const handleOnChangeTextBio = (text) => {
    setBio(text);
  };

  const handleUpdateProfile = async () => {
    if (name === "" || bio === "") return;
    const imageUploaded = userProfile ? await uploadImage(userProfile) : null;

    const docRef = doc(db, "Users", currentUserData.userID);
    await updateDoc(docRef, {
      name: name,
    });

    await updateDoc(docRef, {
      bio: bio,
    });

    await updateDoc(docRef, {
      userProfile: imageUploaded.imageUri,
    });
    navigation.goBack();
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

    if (result.base64.length > 4371340) {
      alert("maximum size 2MB");
      return;
    }
    setUserProfile(result.uri);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
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
    });
  }, []);

  return (
    <Box flex={1} bgColor="#FFF" pt="5" px={"3"}>
      <VStack space={"5"}>
        <TouchableOpacity onPress={handlPickImageFromLocalStorage}>
          <Avatar
            bg={getRandomColor(name[0])}
            alignSelf="center"
            size="xl"
            source={{ uri: userProfile }}
          >
            {name[0]}
          </Avatar>
        </TouchableOpacity>
        <VStack>
          <Text fontSize="md">Name</Text>
          <Input
            variant="underlined"
            value={name}
            onChangeText={handleOnChangeTextname}
          />
        </VStack>
        <VStack>
          <Text fontSize="md">Bio</Text>
          <Input
            variant="underlined"
            value={bio}
            onChangeText={handleOnChangeTextBio}
          />
        </VStack>

        <Button
          onPress={handleUpdateProfile}
          size="xs"
          bgColor="darkBlue.500"
          _text={{ fontSize: "md", color: "lightText" }}
          _pressed={{ bgColor: "darkBlue.300" }}
        >
          Save
        </Button>
      </VStack>
    </Box>
  );
};

export default EditeProfile;
