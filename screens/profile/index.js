import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Text, HStack, VStack } from "native-base";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Card from "../../components/Card";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useContextApi } from "../../lib/hooks/useContexApi";
import SkeletonCard from "../home/components/SkeletonCard";
import { FlatList } from "react-native";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { sendNotification } from "../../lib/functions/removeAndSendNotifications";
import uuid from "react-native-uuid";
import {
  handleFollowUser,
  handleUnfollowUser,
} from "../../lib/functions/handleFollowAndUnfollow";

export default function DetailProfile() {
  const { userTargetID } = useRoute().params;
  const { postCollection, usersCollection, currentUserData } = useContextApi();
  const navigation = useNavigation();

  const [isRefresh, setIsRefresh] = useState(false);
  const [listPostOfCurrentUser, setListPostOfCurrentUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const [isDataAvaliable, setIsDataAvaliable] = useState(false);
  const [isAlreadyFollow, setIsAlreadyFollow] = useState(false);

  const getCurrentUserPost = () => {
    return postCollection.filter((data) => data.userID === userTargetID);
  };

  const getUserProfile = () => {
    return usersCollection.find((data) => data.userID === userTargetID);
  };

  useEffect(() => {
    const currentUserDetail = getUserProfile();
    const isFollow = currentUserDetail.followers.includes(
      currentUserData.userID
    );
    setIsAlreadyFollow(isFollow);
  }, []);

  useEffect(() => {
    const currentUserPost = getCurrentUserPost();
    setListPostOfCurrentUser(currentUserPost);

    const profile = getUserProfile();
    setProfile(profile);

    setTimeout(() => {
      setIsDataAvaliable(true);
    }, 200);
  }, []);

  const handleOnRefresh = () => {
    setIsRefresh(true);
    setIsDataAvaliable(false);

    const currentUserPost = getCurrentUserPost();
    setListPostOfCurrentUser(currentUserPost);

    setTimeout(() => {
      setIsRefresh(false);
      setIsDataAvaliable(true);
    }, 50);
  };

  const handleSendNotification = () => {
    const newData = {
      userID: currentUserData.userID,
      message: `telah mengikuti kamu`,
      createdAt: Timestamp.now(),
      notificationID: uuid.v4(),
    };
    sendNotification(userTargetID, newData);
  };

  const handleFollow = () => {
    setIsAlreadyFollow(true);
    handleSendNotification();

    handleFollowUser({
      currentUserID: currentUserData.userID,
      userTargetID: userTargetID,
    });
  };

  const handleUnFollow = () => {
    setIsAlreadyFollow(false);
    handleUnfollowUser({
      currentUserID: currentUserData.userID,
      userTargetID: userTargetID,
    });
  };

  const handleNavigateToChatingScreen = () => {
    navigation.navigate("Messages", {
      userSenderData: {
        userID: userTargetID,
        docRef: uuid.v4(),
        collRef: uuid.v4(),
      },
    });
  };

  const HeaderList = () => (
    <VStack space="2" p="2" bgColor="lightText" pt="5">
      <Avatar
        bg="darkBlue.500"
        alignSelf="center"
        size="xl"
        source={{
          uri: profile.userProfile,
        }}
      >
        {profile.userName ? profile?.userName[0] : "A"}
        {profile.isOnline && <Avatar.Badge bg="green.500" />}
      </Avatar>
      <Text textAlign="center" fontSize="lg" fontFamily="myFont">
        {profile.userName}
      </Text>
      <HStack space={2} alignItems="center">
        {!isAlreadyFollow && (
          <Button
            onPress={handleFollow}
            bgColor={"darkBlue.500"}
            size="xs"
            _pressed={{ bgColor: "darkBlue.400" }}
            startIcon={<Ionicons name="person-add" size={18} color={"#FFF"} />}
            flex={2}
            _text={{
              fontSize: "sm",
              color: "lightText",
            }}
          >
            Follow
          </Button>
        )}

        {isAlreadyFollow && (
          <>
            <Button
              variant="outline"
              onPress={handleUnFollow}
              size="xs"
              _pressed={{ bgColor: "darkBlue.400" }}
              startIcon={
                <Ionicons name="person-add" size={18} color={"dodgerblue"} />
              }
              borderColor="darkBlue.500"
              flex={2}
              _text={{
                fontSize: "sm",
                color: "dodgerblue",
              }}
            >
              Unfollow
            </Button>
            <Button
              variant="outline"
              borderColor="darkBlue.500"
              onPress={handleNavigateToChatingScreen}
              size="xs"
              _pressed={{ bgColor: "darkBlue.400" }}
              startIcon={<Entypo name="chat" size={18} color="dodgerblue" />}
              flex={2}
              _text={{
                fontSize: "sm",
                color: "dodgerblue",
              }}
            >
              Chat
            </Button>
          </>
        )}
      </HStack>
    </VStack>
  );

  return (
    <>
      {/* list post */}
      {isDataAvaliable ? (
        <FlatList
          ListHeaderComponent={<HeaderList />}
          data={listPostOfCurrentUser}
          keyExtractor={(item) => item.postID}
          renderItem={({ item }) => (
            <Card data={item} avatarOnPress={() => null} />
          )}
          refreshing={isRefresh}
          onRefresh={handleOnRefresh}
        />
      ) : (
        <Box flex={1} bgColor="#FFF">
          {[1, 2, 3, 4, 5].map((data) => (
            <SkeletonCard key={data} />
          ))}
        </Box>
      )}
    </>
  );
}
