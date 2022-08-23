import {
  Avatar,
  Text,
  VStack,
  Button,
  PresenceTransition,
  Box,
  HStack,
  ScrollView,
} from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { getRandomColor } from "../../lib/functions/getRandomColor";
import { useNavigation } from "@react-navigation/native";
import { handleFollowUser } from "../../lib/functions/handleFollowAndUnfollow";

const RedirectScreen = () => {
  const { currentUserData, usersCollection } = useContextApi();
  const navigation = useNavigation();

  let userSuggesion = usersCollection.filter((data) => {
    return data.userID !== currentUserData.userID;
  });

  if (Array.isArray(currentUserData.following)) {
    currentUserData.following.forEach((user) => {
      userSuggesion = userSuggesion.filter((data) => data.userID !== user);
    });
  }
  const [listFollowUserSuggesion, setListFollowUserSuggesion] = useState(
    userSuggesion
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Ikuti 5 orang yang mungkin anda kenal",
      headerLeft: () => <Text></Text>,
    });
  });

  const handleFollow = (ID) => {
    handleFollowUser({
      currentUserID: currentUserData.userID,
      userTargetID: ID,
    });
    const newUser = listFollowUserSuggesion.filter(
      (user) => user.userID !== ID
    );
    setListFollowUserSuggesion(newUser);
  };



  return (
    <Box flex={1} bg="#FFF" px="2">
      <ScrollView showsVerticalScrollIndicator={false}>
        <HStack alignItems="center" flexWrap="wrap">
          {listFollowUserSuggesion.map((item, index) => (
            <PresenceTransition
              key={index}
              visible={true}
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: index * 500 + 500,
                },
              }}
            >
              <VStack
                alignItems="center"
                justifyContent="center"
                w="40"
                h="48"
                m="4"
                borderWidth={"1"}
                borderColor="gray.200"
                borderRadius="md"
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("DetailProfile", {
                      userTargetID: item.userID,
                    })
                  }
                >
                  <Avatar
                    bg={getRandomColor(item.name[0])}
                    source={{ uri: item.userProfile }}
                  >
                    {item.name[0]}
                    {item.isOnline && <Avatar.Badge bg="green.500" />}
                  </Avatar>
                </TouchableOpacity>
                <Text style={{ fontFamily: "myFont" }}>{item.name} </Text>
                <Text color="gray.500" fontSize="xs">
                  {item.userName}
                </Text>
                <Button
                  onPress={() => handleFollow(item.userID)}
                  bgColor="darkBlue.500"
                  size="xs"
                  mt="5"
                  _pressed={{ bgColor: "darkBlue.300" }}
                  width={"24"}
                >
                  Follow
                </Button>
              </VStack>
            </PresenceTransition>
          ))}
        </HStack>
      </ScrollView>

      <HStack h="16" justifyContent="center" alignItems="center" space="10">
        <Text fontFamily="myFont" fontSize="md">
          {listFollowUserSuggesion.length}/5 mengikuti
        </Text>
      </HStack>
    </Box>
  );
};

export default RedirectScreen;
