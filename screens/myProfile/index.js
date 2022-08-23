import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box, Button, Text } from "native-base";
import { Feather, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import Card from "../../components/Card";
import { useNavigation } from "@react-navigation/native";

import { signOut } from "firebase/auth";
import { auth } from "../../lib/config/firebase";
import { useContextApi } from "../../lib/hooks/useContexApi";
import SkeletonCard from "../home/components/SkeletonCard";
import { FlatList } from "react-native";
import AlertDialogStyle from "../../components/AlertDialogStyle";
import HeaderProfile from "../../components/HeaderProfile";

export default function MyProfile() {
  const { setIsAuth, postCollection, currentUserData } = useContextApi();
  const navigation = useNavigation();

  const [isRefresh, setIsRefresh] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(false);

  const [listPostOfCurrentUser, setListPostOfCurrentUser] = useState([]);
  const [profile, setProfile] = useState([]);

  const [isDataAvaliable, setIsDataAvaliable] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsAuth(false);
        navigation.navigate("Login");
      })
      .catch(console.error);
  };

  const getCurrentUserPost = () => {
    return postCollection.filter(
      (data) => data.userID === currentUserData.userID
    );
  };

  useEffect(() => {
    const currentUserPost = getCurrentUserPost();
    setListPostOfCurrentUser(currentUserPost);
    setProfile(currentUserData);

    setTimeout(() => {
      setIsDataAvaliable(true);
    }, 50);
  }, [currentUserData]);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Profile",
      headerRight: () => (
        <Button
          onPress={() => setDisplayAlert(true)}
          variant="ghost"
          colorScheme="blue"
          leftIcon={
            <MaterialIcons name="logout" size={20} color="dodgerblue" />
          }
        >
          Logout
        </Button>
      ),
    });
  }, []);

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
      <Button
        bgColor="darkBlue.500"
        size="xs"
        _pressed={{ bgColor: "darkBlue.400" }}
        startIcon={<Feather name="edit-3" size={18} color="#FFF" />}
        _text={{ fontSize: "sm" }}
        flex={2}
        onPress={() => navigation.navigate("EditeProfile")}
      >
        Edit profile
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
      <AlertDialogStyle
        isOpen={displayAlert}
        setIsOpen={setDisplayAlert}
        title="Logout"
        description="apakah anda yakin ingin keluar?"
        buttonTitleAction="Logout"
        buttonTitleCancle="cancle"
        onButtonActionPres={handleLogout}
      />
    </Box>
  );
}
