import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box, Button, Text } from "native-base";
import { Entypo, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Card from "../../components/Card";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useContextApi } from "../../lib/hooks/useContexApi";
import SkeletonCard from "../home/components/SkeletonCard";
import { FlatList } from "react-native";
import { Timestamp } from "firebase/firestore";
import { sendNotification } from "../../lib/functions/handleNotification";
import uuid from "react-native-uuid";
import {
  handleFollowUser,
  handleUnfollowUser,
} from "../../lib/functions/handleFollowAndUnfollow";
import HeaderProfile from "../../components/HeaderProfile";

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
    }, 50);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: profile.name || "",
    });
  }, [profile]);

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
    const isChatRoomExis = currentUserData.chatList.find(
      (chat) => chat.userSenderID === userTargetID
    );

    if (isChatRoomExis) {
      navigation.navigate("Messages", {
        userSenderData: {
          userID: userTargetID,
          docRef: isChatRoomExis.docRef,
          collRef: isChatRoomExis.collRef,
          name: profile.name,
          userProfile: profile.userProfile,
          isOnline: profile.isOnline,
        },
      });
    } else {
      navigation.navigate("Messages", {
        userSenderData: {
          userID: userTargetID,
          docRef: uuid.v4(),
          collRef: uuid.v4(),
          name: profile.name,
          userProfile: profile.userProfile,
          isOnline: profile.isOnline,
        },
      });
    }
  };

  const HeaderList = () => (
    <HeaderProfile
      isOnline={profile.isOnline}
      name={profile.name}
      userName={profile.userName}
      userProfile={profile.userProfile}
      totalPost={listPostOfCurrentUser.length}
      followers={profile.followers.length}
      following={profile.following.length}
      bio={profile.bio}
      joinAt={profile.joinAt}
      isVerified={profile.isVerified}
    >
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
        </>
      )}
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
    </HeaderProfile>
  );

  return (
    <Box flex={1} bgColor="#FFF">
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

      {listPostOfCurrentUser.length === 0 && (
        <Box flex={1} alignItems="center">
          <FontAwesome5 name="list-alt" size={50} color="gray" />
          <Text style={{ color: "gray" }}>Belum ada postingan</Text>
        </Box>
      )}
    </Box>
  );
}
