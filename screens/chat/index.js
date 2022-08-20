import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  VStack,
  Avatar,
  HStack,
  Box,
  Divider,
  IconButton,
} from "native-base";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { FlatList, TouchableOpacity } from "react-native";
import { getRandomColor } from "../../lib/functions/getRandomColor";
import uuid from "react-native-uuid";
import { Entypo, FontAwesome } from "@expo/vector-icons";

const Chat = () => {
  const { usersCollection, currentUserData } = useContextApi();
  const navigation = useNavigation();

  const [chatList, setChatList] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (Array.isArray(currentUserData.following)) {
      const allUserSenderID = currentUserData.chatList.map((chat) => {
        return chat.userSenderID;
      });

      const listUserFollowing = [];
      currentUserData.following.forEach((userFollowing) => {
        if (allUserSenderID.includes(userFollowing)) return;
        const getUserFollowing = usersCollection.find((data) => {
          return data.userID === userFollowing;
        });
        listUserFollowing.push({
          collRef: uuid.v4(),
          docRef: uuid.v4(),
          isOnline: getUserFollowing.isOnline,
          userProfile: getUserFollowing.userProfile,
          userName: getUserFollowing.userName,
          userID: getUserFollowing.userID,
        });
      });
      setFollowing(listUserFollowing);
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(currentUserData.chatList)) {
      const userSenders = [];
      currentUserData.chatList.forEach((list) => {
        const getUserSender = usersCollection.find(
          (data) => data.userID === list.userSenderID
        );
        userSenders.push({
          collRef: list.collRef,
          docRef: list.docRef,
          isOnline: getUserSender.isOnline,
          userProfile: getUserSender.userProfile,
          userName: getUserSender.userName,
          userID: getUserSender.userID,
        });
      });
      setChatList(userSenders);
    }
  }, []);

  const handleNavigateToChatMessage = (userSender) => {
    navigation.navigate("Messages", { userSenderData: userSender });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          onPress={() => navigation.navigate("Search")}
          variant="ghost"
          borderRadius="full"
          bg={"darkBlue.50"}
          mr="3"
          _pressed={{ bg: "gray.50" }}
          _icon={{
            as: FontAwesome,
            name: "search",
            size: "md",
            color: "darkBlue.500",
          }}
        />
      ),
    });
  }, []);

  const RenderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleNavigateToChatMessage(item)}>
        <HStack
          px="2"
          my="3"
          justifyContent="space-between"
          alignItems="center"
        >
          <HStack space={5} alignItems="center">
            <Avatar
              bg={getRandomColor(item.userName[0])}
              source={{
                uri: item.userProfile,
              }}
            >
              {item.userName[0]}
              {item.isOnline && <Avatar.Badge bg="green.500" />}
            </Avatar>
            <VStack>
              <Text fontSize="md" fontFamily="myFont">
                {item.userName}
              </Text>
              <Text fontSize="xs" color="gray.500">
                hello world
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </TouchableOpacity>
    );
  };

  const HeaderList = () => (
    <>
      <FlatList
        style={{ marginVertical: 7 }}
        horizontal
        data={following}
        keyExtractor={(item) => item.userID}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleNavigateToChatMessage(item)}>
            <Avatar
              mx={"2"}
              bg={getRandomColor(item.userName[0])}
              source={{
                uri: item.userProfile,
              }}
            >
              {item.userName[0]}
              {item.isOnline && <Avatar.Badge bg="green.500" />}
            </Avatar>
          </TouchableOpacity>
        )}
      />
      {following.length !== 0 && <Divider />}
    </>
  );

  return (
    <Box flex={1} bgColor="lightText">
      {chatList.length === 0 && (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Entypo name="chat" size={70} color="gray" />
          <Text style={{ color: "gray", fontSize: 18 }}>Tidak ada Pesan</Text>
        </Box>
      )}
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.userID}
        renderItem={({ item }) => <RenderItem item={item} />}
      />
    </Box>
  );
};

export default Chat;
