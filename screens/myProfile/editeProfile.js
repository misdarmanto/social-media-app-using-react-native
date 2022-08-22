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

const EditeProfile = () => {
  const { currentUserData } = useContextApi();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    setUserProfile(currentUserData.userProfile);
    setName(currentUserData.name);
    setBio(currentUserData.bio);
  }, []);

  const handleOnChangeTextname = (text) => {
    setName(text);
  };

  const handleOnChangeTextBio = (text) => {
    setBio(text);
  };

  const handleUpdateProfile = async () => {
    if (name === "" || bio === "") return;

    const docRef = doc(db, "Users", currentUserData.userID);
    await updateDoc(docRef, {
      name: name,
    });

    await updateDoc(docRef, {
      bio: bio,
    });

    await updateDoc(docRef, {
      userProfile: userProfile,
    });
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

      headerRight: () => (
        <Button
          variant="ghost"
          onPress={() => {
            handleUpdateProfile().then(() => navigation.goBack());
          }}
          _text={{ color: "darkBlue.500", fontSize: "xl" }}
        >
          Save
        </Button>
      ),
    });
  }, []);

  return (
    <Box flex={1} bgColor="#FFF" pt="5" px={"3"}>
      <VStack space={"5"}>
        <TouchableOpacity>
          <Avatar
            bg={getRandomColor(currentUserData.name[0])}
            alignSelf="center"
            size="xl"
            source={{
              uri: currentUserData.userProfile,
            }}
          >
            {currentUserData.name[0]}
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
      </VStack>
    </Box>
  );
};

export default EditeProfile;
