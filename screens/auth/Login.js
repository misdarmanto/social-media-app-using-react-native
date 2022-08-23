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
  Spinner,
  ScrollView,
  Checkbox,
} from "native-base";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../lib/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { emailInputCheck, passwordInputCheck } from "./functions/inputCheck";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState({ isError: false, message: "" });

  const [password, setPassword] = useState(null);
  const [showPassword, setShowPasshowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState({
    isError: false,
    message: "",
  });

  const navigation = useNavigation();

  const handleSubmit = () => {
    const emailInputCheckResult = emailInputCheck(email);
    setEmailError(emailInputCheckResult);
    if (emailInputCheckResult.isError) return;

    const passwordInputCheckResult = passwordInputCheck(password);
    setPasswordError(passwordInputCheckResult);
    if (passwordInputCheckResult.isError) return;

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setEmail(null);
        setPassword(null);
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            setEmailError({
              isError: true,
              message: "Opss... email tidak valid",
            });
            break;
          case "auth/email-already-in-use":
            setEmailError({
              isError: true,
              message: "Opss... email sudah digunakan",
            });
            break;
          case "auth/user-not-found":
            setEmailError({
              isError: true,
              message: "Opss... user tidak ditemukan, silahkan buat akun",
            });
            break;
          case "auth/wrong-password":
            setPasswordError({
              isError: true,
              message: "Opss... Password salah",
            });
            break;
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <ScrollView flex={1} bgColor="#FFF">
      <VStack space="10" pt="50%">
        {isLoading && (
          <Spinner
            color="darkBlue.500"
            position="absolute"
            top="50%"
            right="50%"
            zIndex={1}
          />
        )}
        <Heading textAlign="center" color="darkBlue.500">
          SignIn
        </Heading>

        <Stack space={4} p={"5"}>
          <FormControl isInvalid={emailError.isError}>
            <Input
              bgColor={"gray.100"}
              borderColor={emailError.isError ? "red" : "gray.200"}
              borderRadius={"10"}
              _focus={{
                borderColor: emailError.isError ? "red" : "darkBlue.100",
              }}
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

          <FormControl isInvalid={passwordError.isError}>
            <Input
              bgColor={"gray.100"}
              borderColor={passwordError.isError ? "red" : "gray.200"}
              borderRadius={"10"}
              _focus={{
                borderColor: passwordError.isError ? "red" : "darkBlue.100",
              }}
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
                  onPress={() => setShowPasshowPassword(!showPassword)}
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
            Login
          </Button>
        </Stack>

        <HStack space={"2"} alignItems="center" justifyContent="center">
          <Text color="gray.500">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text fontSize={"md"} color="darkBlue.500">
              SignUp
            </Text>
          </TouchableOpacity>
        </HStack>
      </VStack>
    </ScrollView>
  );
}
