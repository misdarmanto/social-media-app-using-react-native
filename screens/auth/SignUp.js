import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Input,
  Icon,
  Stack,
  Button,
  HStack,
  Text,
  FormControl,
  WarningOutlineIcon,
} from "native-base";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { useContextApi } from "../../lib/hooks/useContexApi";

export default function SignUp() {
  const { setIsAuth } = useContextApi();

  const [name, setName] = useState(null);
  const [nameError, setNameError] = useState({
    isError: false,
    message: "",
  });

  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState({ isError: false, message: "" });

  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState({
    isError: false,
    message: "",
  });

  const navigation = useNavigation();

  const handleSubmit = () => {
    if (!email) {
      setEmailError({ isError: true, message: "email field can't empty" });
      return;
    }

    if (!name) {
      setNameError({ isError: true, message: "name field can't empty" });
      return;
    }

    if (name.length <= 3 || name.length >= 15) {
      setNameError({
        isError: true,
        message: "name character should be 3 to 15",
      });
      return;
    }

    if (!password) {
      setPasswordError({
        isError: true,
        message: "password field can't empty",
      });
      return;
    }

    const createUserDB = async (data, userID) => {
      try {
        const userCollectionsRef = doc(db, "Users", userID);
        setDoc(userCollectionsRef, data);
      } catch (e) {
        console.error(e);
      }
    };

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          name: name,
          email: user.email,
          userProfile: user.photoURL,
          isOnline: true,
          bio: "",
          chatList: [],
          followers: [],
          following: [],
          notifications: [],
        };
        createUserDB(userData, user.email).then(() => {
          setIsAuth(true);
          setEmail(null);
          setName(null);
          setPassword(null);
        });
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            setEmailError({ message: "email tidak valid", isError: true });
            break;
          case "auth/email-already-in-use":
            setEmailError({ message: "email sudah digunakan", isError: true });
            break;
          case "auth/weak-password":
            setPasswordError({ message: "password tidak aman", isError: true });
            break;
        }
      });
  };

  return (
    <VStack flex={1} space={"20"} bgColor="darkBlue.500" pt="30%">
      <Heading textAlign="center" color="lightText">
        SignUp
      </Heading>
      <Box
        flex={2}
        bgColor="lightText"
        borderTopRadius="30"
        alignItems="center"
        justifyContent="center"
      >
        <Stack space={4} w="100%" p={"5"}>
          <FormControl isInvalid={emailError.isError}>
            <Input
              bgColor={"gray.100"}
              borderColor="gray.200"
              borderRadius={"10"}
              _focus={{ borderColor: "darkBlue.100" }}
              InputLeftElement={
                <Icon
                  as={<Entypo name="email" size={24} />}
                  size={5}
                  ml="2"
                  color="muted.400"
                />
              }
              value={email}
              onChangeText={setEmail}
              onChange={() => setEmailError({ isError: false, message: "" })}
              placeholder="E-mail"
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {emailError.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={nameError.isError}>
            <Input
              bgColor={"gray.100"}
              borderColor="gray.200"
              borderRadius={"10"}
              _focus={{ borderColor: "darkBlue.100" }}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="person" />}
                  size={5}
                  ml="2"
                  color="muted.400"
                />
              }
              value={name}
              onChangeText={setName}
              onChange={() => setNameError({ isError: false, message: "" })}
              placeholder="Name"
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {nameError.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={passwordError.isError}>
            <Input
              bgColor={"gray.100"}
              borderColor="gray.200"
              borderRadius={"10"}
              _focus={{ borderColor: "darkBlue.100" }}
              type={showPassword ? "text" : "password"}
              InputRightElement={
                <Icon
                  as={
                    <MaterialIcons
                      name={showPassword ? "visibility" : "visibility-off"}
                    />
                  }
                  size={5}
                  mr="2"
                  color="muted.400"
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              value={password}
              onChangeText={setPassword}
              onChange={() => setPasswordError({ isError: false, message: "" })}
              placeholder="Password"
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {passwordError.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <Button
            mt={"5"}
            bgColor="darkBlue.500"
            borderRadius={"10"}
            _pressed={{ bgColor: "darkBlue.400" }}
            onPress={handleSubmit}
          >
            SignUp
          </Button>
        </Stack>

        <HStack space={"2"} alignItems="center" justifyContent="center">
          <Text color="gray.500">already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text fontSize={"md"} color="darkBlue.500">
              SignIn
            </Text>
          </TouchableOpacity>
        </HStack>
      </Box>
    </VStack>
  );
}
