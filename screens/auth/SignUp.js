import React, { useCallback, useEffect, useState } from "react";
import {
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
  ScrollView,
  Checkbox,
} from "native-base";
import { MaterialIcons, Entypo, Feather } from "@expo/vector-icons";
import { TouchableOpacity, Linking, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { useContextApi } from "../../lib/hooks/useContexApi";
import {
  emailInputCheck,
  nameInputCheck,
  passwordInputCheck,
  userNameInputCheck,
} from "./functions/inputCheck";

export default function SignUp() {
  const { setIsAuth, allUserNameTags, setCurrentUserData } = useContextApi();

  const [name, setName] = useState(null);
  const [nameError, setNameError] = useState({
    isError: false,
    message: "",
  });

  const [userName, setUserName] = useState(null);
  const [userNameError, setUserNameError] = useState({
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

  const [termsAndConditionChekBox, setTermsAndConditionChekBox] = useState({
    isCheked: false,
    isError: false,
  });

  const navigation = useNavigation();

  useEffect(() => {
    const getTags = allUserNameTags.map((tag) => tag.toUpperCase());
    if (getTags.includes(`@${userName}`.toUpperCase())) {
      setUserNameError({ isError: true, message: "user name sudah digunakan" });
      return;
    }
    console.log(userName);
  }, [userName]);

  const handleSubmit = () => {
    const emailInputCheckResult = emailInputCheck(email);
    setEmailError(emailInputCheckResult);
    if (emailInputCheckResult.isError) return;

    const nameInputCheckResult = nameInputCheck(name);
    setNameError(nameInputCheckResult);
    if (nameInputCheckResult.isError) return;

    const userNameInputCheckResult = userNameInputCheck(userName);
    setUserNameError(userNameInputCheckResult);
    if (userNameInputCheckResult.isError) return;

    const passwordInputCheckResult = passwordInputCheck(password);
    setPasswordError(passwordInputCheckResult);
    if (passwordInputCheckResult.isError) return;

    if (!termsAndConditionChekBox.isCheked) {
      setTermsAndConditionChekBox({ isCheked: false, isError: true });
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
        const createdAt = new Date().toDateString();
        const user = userCredential.user;
        const userData = {
          name: name,
          userName: `@${userName}`,
          email: user.email,
          userProfile: user.photoURL,
          isOnline: true,
          isVerified: false,
          bio: "",
          chatList: [],
          followers: [],
          following: [],
          notifications: [],
          joinAt: createdAt,
        };
        createUserDB(userData, user.email).then(() => {
          setEmail(null);
          setName(null);
          setUserName(null);
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

  const handleLinkOnPress = useCallback(async () => {
    const url =
      "https://www.privacypolicyonline.com/live.php?token=Uvo29NkYm1zXTClkdCLdFtTalfYqqB6z";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, []);

  return (
    <ScrollView flex={1} bgColor="#FFF" showsVerticalScrollIndicator={false}>
      <VStack space={"10"} pt="50%">
        <Heading textAlign="center" color="darkBlue.500" fontFamily="myFont">
          SignUp
        </Heading>

        <Stack space={4} p={"5"}>
          <FormControl isInvalid={emailError.isError}>
            <Input
              bgColor={"gray.50"}
              borderColor="gray.200"
              borderRadius={"10"}
              _focus={{ borderColor: "darkBlue.100" }}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="email" />}
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
              bgColor={"gray.50"}
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

          <FormControl isInvalid={userNameError.isError}>
            <Input
              bgColor={"gray.50"}
              borderColor="gray.200"
              borderRadius={"10"}
              _focus={{ borderColor: "darkBlue.100" }}
              InputLeftElement={
                <Icon
                  as={<Feather name="at-sign" />}
                  size={5}
                  ml="2"
                  color="muted.400"
                />
              }
              value={userName}
              onChangeText={(text) => {
                setUserName(text.split(" ").join("_"));
              }}
              onChange={() => setUserNameError({ isError: false, message: "" })}
              placeholder="User name"
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {userNameError.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={passwordError.isError}>
            <Input
              bgColor={"gray.50"}
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

          <FormControl isInvalid={termsAndConditionChekBox.isError}>
            <HStack alignItems="center" space="2">
              <Checkbox
                value={true}
                onChange={(value) => {
                  setTermsAndConditionChekBox({
                    isCheked: value,
                    isError: false,
                  });
                }}
                accessibilityLabel="terms & conditions"
              />

              <HStack alignItems="center" space="1">
                <Text color={"gray.500"}>I accept the</Text>
                <TouchableOpacity onPress={handleLinkOnPress}>
                  <Text color="darkBlue.500">terms & conditions</Text>
                </TouchableOpacity>
              </HStack>
            </HStack>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              You must select the terms & conditions
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
          <Text color="gray.500">Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text fontSize={"md"} color="darkBlue.500">
              SignIn
            </Text>
          </TouchableOpacity>
        </HStack>
      </VStack>
    </ScrollView>
  );
}
