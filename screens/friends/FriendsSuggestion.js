import { Avatar, Text, VStack, Button } from "native-base";
import React, { useLayoutEffect } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { getRandomColor } from "../../lib/functions/getRandomColor";
import { useNavigation } from "@react-navigation/native";

const FriendsSuggestion = () => {
  const { currentUserData, usersCollection } = useContextApi();
  const navigation = useNavigation();

  const userSuggesion = usersCollection.filter((data) => {
    return data.userID !== currentUserData.userID;
  });

  let listFollowUserSuggesion = userSuggesion;

  if (Array.isArray(currentUserData.following)) {
    currentUserData.following.forEach((user) => {
      listFollowUserSuggesion = listFollowUserSuggesion.filter(
        (data) => data.userID !== user
      );
    });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "cari teman",
    });
  });

  return (
    <VStack flex={1} minHeight={20} bg="#FFF">
      {listFollowUserSuggesion.length !== 0 && (
        <FlatList
          horizontal
          data={listFollowUserSuggesion}
          keyExtractor={(item) => item.userID}
          style={{
            borderColor: "#e3e3e3",
            borderBottomWidth: 1,
            borderTopWidth: 1,
            paddingVertical: 10,
          }}
          renderItem={({ item }) => (
            <VStack
              alignItems="center"
              justifyContent="center"
              w="32"
              h="40"
              mx="2"
              space={2}
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

              <Button
                bgColor="darkBlue.500"
                size="xs"
                _pressed={{ bgColor: "darkBlue.300" }}
                width={"24"}
              >
                Follow
              </Button>
            </VStack>
          )}
        />
      )}
    </VStack>
  );
};

export default FriendsSuggestion;
