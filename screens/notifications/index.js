import { Box, HStack, Text, Avatar, VStack } from "native-base";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { getRandomColor } from "../../lib/functions/getRandomColor";
import { convertTimeToString } from "../../lib/functions/convertTime";
import { removeNotification } from "../../lib/functions/handleNotification";
import { Ionicons, Entypo } from "@expo/vector-icons";
import {
  clearLoacalStorage,
  getDataFromLocalStorage,
  storeDataToLocalStorage,
} from "../../lib/functions/localStorage";

export default function Notifications() {
  const { currentUserData, usersCollection } = useContextApi();
  const [listNotifications, setListNotifications] = useState([]);

  const handleRemoveAllNotification = () => {
    clearLoacalStorage();
  };

  const handleDeleteNotification = async (ID) => {
    const newNoification = listNotifications.filter((data) => {
      return data.notificationID !== ID;
    });
    const KEY = "notifications";
    storeDataToLocalStorage(KEY, newNoification);
    setListNotifications(newNoification);
  };

  const getNotifications = () => {
    if (Array.isArray(currentUserData.notifications)) {
      const result = [];
      currentUserData.notifications.forEach((data) => {
        const getUserSenderNotification = usersCollection.find(
          (user) => user.userID === data.userID
        );
        result.push({
          userID: getUserSenderNotification.userID,
          userProfile: getUserSenderNotification.userProfile,
          userName: getUserSenderNotification.userName,
          message: data.message,
          createdAt: data.createdAt,
          notificationID: data.notificationID,
        });
      });
      return result;
    } else {
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      const KEY = "notifications";
      const notifications = getNotifications();
      const notificationFormLoacalStorage = await getDataFromLocalStorage(KEY);

      if (notifications.length !== 0) {
        storeDataToLocalStorage(KEY, [
          ...notifications,
          ...notificationFormLoacalStorage,
        ]);
      }

      setListNotifications([
        ...notifications,
        ...notificationFormLoacalStorage,
      ]);
    })();

    return () => {
      removeNotification(currentUserData.userID);
    };
  }, []);

  const RenderItem = ({ item }) => (
    <HStack
      px="2"
      py="5"
      mb="2"
      justifyContent="space-between"
      alignItems="center"
      bgColor="#FFF"
    >
      <HStack space={5} alignItems="center">
        <Avatar
          bg={getRandomColor(item.userName[0])}
          source={{
            uri: item.userProfile,
          }}
        >
          {item.userName[0]}
        </Avatar>
        <VStack>
          <HStack alignItems="center" space={1}>
            <Text fontSize="sm" fontWeight="extrabold">
              {item.userName}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {item.message}
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.400">
            {convertTimeToString(item.createdAt.seconds)}
          </Text>
        </VStack>
      </HStack>
      <TouchableOpacity onPress={() => handleDeleteNotification(item.notificationID)}>
        <Entypo name="cross" size={24} color="gray" />
      </TouchableOpacity>
    </HStack>
  );

  return (
    <Box flex={1}>
      {listNotifications.length === 0 && (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Ionicons name="notifications-off" size={50} color="gray" />
          <Text style={{ color: "gray" }}>Tidak ada notifikasi</Text>
        </Box>
      )}
      <FlatList
        data={listNotifications}
        keyExtractor={(item) => item.notificationID}
        renderItem={({ item }) => <RenderItem item={item} />}
      />
    </Box>
  );
}
