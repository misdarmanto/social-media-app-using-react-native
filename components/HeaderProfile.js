import React from "react";
import { VStack, HStack, Avatar, Text } from "native-base";
import { getRandomColor } from "../lib/functions/getRandomColor";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const HeaderProfile = ({
  name,
  userName,
  bio,
  isOnline,
  userProfile,
  totalPost,
  followers,
  following,
  children,
  joinAt,
  isVerified,
}) => {
  return (
    <VStack p="3" bgColor="lightText" pt="5">
      <HStack alignItems="center" space="5" my="2">
        <Avatar
          bg={getRandomColor(name[0])}
          size="lg"
          source={{
            uri: userProfile,
          }}
        >
          {name[0]}
          {isOnline && <Avatar.Badge bg="green.500" />}
        </Avatar>
        <VStack>
          <Text textAlign="center" fontSize="sm" fontFamily="myFont">
            {totalPost}
          </Text>
          <Text textAlign="center" fontSize="sm" fontFamily="myFont">
            Postingan
          </Text>
        </VStack>
        <VStack>
          <Text textAlign="center" fontSize="sm" fontFamily="myFont">
            {followers}
          </Text>
          <Text textAlign="center" fontSize="sm" fontFamily="myFont">
            Pengikut
          </Text>
        </VStack>
        <VStack>
          <Text textAlign="center" fontSize="sm" fontFamily="myFont">
            {following}
          </Text>
          <Text textAlign="center" fontSize="sm" fontFamily="myFont">
            Mengikuti
          </Text>
        </VStack>
      </HStack>
      <VStack>
        <HStack alignItems="center" space="1">
          <Text fontSize="lg" fontFamily="myFont">
            {name}
          </Text>
          {isVerified && (
            <MaterialIcons name="verified" size={18} color="dodgerblue" />
          )}
        </HStack>
        <Text color="gray.500">{userName}</Text>
        {bio.length !== 0 && <Text color="gray.500">{bio}</Text>}
      </VStack>
      <HStack alignItems="center" space="2" pt="1">
        {joinAt && (
          <>
            <FontAwesome name="calendar" size={20} color="gray" />
            <Text fontSize="sm" color="gray.500">
              {joinAt}
            </Text>
          </>
        )}
      </HStack>
      <HStack space={2} alignItems="center" mt="5">
        {children}
      </HStack>
    </VStack>
  );
};

export default HeaderProfile;
