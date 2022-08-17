import React, { useEffect, useLayoutEffect, useState } from "react";
import { Avatar, Box, Button, Text, HStack, VStack } from "native-base";
import { Feather, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import Card from "../../components/Card";
import { useNavigation } from "@react-navigation/native";

import { signOut } from "firebase/auth";
import { auth } from "../../lib/config/firebase";
import { useContextApi } from "../../lib/hooks/useContexApi";
import SkeletonCard from "../home/components/SkeletonCard";
import { FlatList } from "react-native";
import AlertDialogStyle from "../../components/AlertDialogStyle";
import { getRandomColor } from "../../lib/functions/getRandomColor";

export default function MyProfile() {
  const {
    setIsAuth,
    postCollection,
    currentUserData,
    usersCollection,
  } = useContextApi();
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

  const getUserProfile = () => {
    return usersCollection.find(
      (data) => data.userID === currentUserData.userID
    );
  };

  useEffect(() => {
    const currentUserPost = getCurrentUserPost();
    setListPostOfCurrentUser(currentUserPost);

    const profile = getUserProfile();
    setProfile(profile);

    setTimeout(() => {
      setIsDataAvaliable(true);
    }, 50);
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

  useLayoutEffect(() => {
    navigation.setOptions({
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
    <VStack space="2" p="2" bgColor="lightText" pt="5">
      <Avatar
        bg={getRandomColor(profile?.userName[0])}
        alignSelf="center"
        size="xl"
        source={{
          uri: profile.userProfile,
        }}
      >
        {profile.userName[0]}
        {profile.isOnline && <Avatar.Badge bg="green.500" />}
      </Avatar>
      <Text textAlign="center" fontSize="lg" fontFamily="myFont">
        {profile.userName}
      </Text>
      <HStack space={2} alignItems="center">
        <Button
          bgColor="darkBlue.500"
          size="xs"
          _pressed={{ bgColor: "darkBlue.400" }}
          startIcon={<Feather name="edit-3" size={20} color="#FFF" />}
          _text={{ fontSize: "md" }}
          flex={2}
          onPress={() => navigation.navigate("EditeProfile")}
        >
          Edit profile
        </Button>
      </HStack>
    </VStack>
  );

  return (
    <Box flex={1} bgColor="#FFF">
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
