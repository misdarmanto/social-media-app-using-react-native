import { Heading, VStack, Text, Button, HStack, IconButton } from "native-base";
import { TouchableOpacity } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Welcome() {
  const navigation = useNavigation();

  return (
    <VStack
      flex={1}
      space="8"
      bgColor="darkBlue.500"
      pt="30%"
      justifyContent="center"
    >
      <HStack justifyContent="center" alignItems="center" space={2}>
        <FontAwesome5 name="feather-alt" color="#FFF" size={35} />
        <Text color="lightText" style={{ fontSize: 20, fontFamily: "myFont" }}>
          Ndopok Club
        </Text>
      </HStack>
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
