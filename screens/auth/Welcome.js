import { Box, Heading, VStack, Text, Button, HStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Welcome() {
  const navigation = useNavigation();

  return (
    <VStack
      flex={1}
      space={"18"}
      bgColor="darkBlue.500"
      pt="30%"
      justifyContent="center"
    >
      <Heading textAlign="center" color="lightText">
        Welcome
      </Heading>
      <VStack p={"5"} space={"5"}>
        <Button
          variant="solid"
          bgColor="lightText"
          startIcon={<AntDesign name="google" size={24} color="dodgerblue" />}
          size="md"
          borderWidth={"2"}
          borderRadius={"10"}
          borderColor="lightText"
          _text={{ color: "darkBlue.500" }}
          _pressed={{ borderColor: "light.100", bgColor: "darkBlue.50" }}
        >
          SignIn with Google
        </Button>

        <Button
          onPress={() => navigation.navigate("SignUp")}
          variant="outline"
          size="md"
          borderWidth={"2"}
          borderRadius={"10"}
          borderColor="lightText"
          color="lightText"
          _text={{ color: "lightText" }}
          _pressed={{ borderColor: "light.100", bgColor: "darkBlue.400" }}
        >
          Create an account
        </Button>

        <HStack space={"2"} alignItems="center" justifyContent="center">
          <Text color="light.200">already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text fontSize={"md"} color="lightText">
              SignIn
            </Text>
          </TouchableOpacity>
        </HStack>
      </VStack>
    </VStack>
  );
}
