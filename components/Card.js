import React, { useEffect, useState } from "react";
import {
  Box,
  HStack,
  Avatar,
  VStack,
  Text,
  IconButton,
  Modal,
  Stack,
  Divider,
  Actionsheet,
} from "native-base";
import {
  Entypo,
  Octicons,
  MaterialCommunityIcons,
  Foundation,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { convertTimeToString } from "../lib/functions/convertTime";
import { getRandomColor } from "../lib/functions/getRandomColor";
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../lib/config/firebase";
import { useContextApi } from "../lib/hooks/useContexApi";
import AlertDialogStyle from "./AlertDialogStyle";
import ModalStyle from "./ModalStyle";
import { shareThisApp } from "../lib/functions/shareThisApp";

const Card = ({ data, avatarOnPress, isOnCommentScreen }) => {
  const {
    userName,
    userProfile,
    createdAt,
    text,
    likes,
    comments,
    isOnline,
    image,
    docPostID,
    postID,
    userID,
    upVote,
  } = data;
  const navigation = useNavigation();
  const { currentUserData } = useContextApi();
  const isCurrentUserPost = currentUserData.userID === userID;

  const [openModal, setOpenModal] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(false);

  const [likesTotal, setlikesTotal] = useState(0);
  const [isUserAlreadyLike, setIsUserAlreadyLike] = useState(false);
  const [upVoteTotal, setUpVoteTotal] = useState(0);
  const [isUserAlreadyUpVote, setIsUserAlreadyUpVote] = useState(false);

  useEffect(() => {
    const isIncludeLike = likes.includes(currentUserData.userID);
    setIsUserAlreadyLike(isIncludeLike);
    setlikesTotal(likes.length);

    const isIncludeUpVote = upVote.includes(currentUserData.userID);
    setIsUserAlreadyUpVote(isIncludeUpVote);
    setUpVoteTotal(upVote.length);
  }, []);

  const handleIncrementLike = async () => {
    const docPostRef = doc(db, "Post", docPostID);

    if (isUserAlreadyLike) {
      if (likesTotal === 0) return;
      setlikesTotal(likesTotal - 1);
      setIsUserAlreadyLike(false);

      await updateDoc(docPostRef, {
        likes: arrayRemove(currentUserData.userID),
      });
    } else {
      setlikesTotal(likesTotal + 1);
      setIsUserAlreadyLike(true);

      await updateDoc(docPostRef, {
        likes: arrayUnion(currentUserData.userID),
      });
    }
  };

  const handleIncrementUpVote = async () => {
    const docPostRef = doc(db, "Post", docPostID);

    if (isUserAlreadyUpVote) {
      await updateDoc(docPostRef, {
        upVote: arrayRemove(currentUserData.userID),
      });
      setIsUserAlreadyUpVote(false);
      if (upVoteTotal === 0) return;
      setUpVoteTotal(upVoteTotal - 1);
    } else {
      await updateDoc(docPostRef, {
        upVote: arrayUnion(currentUserData.userID),
      });
      setIsUserAlreadyUpVote(true);
      setUpVoteTotal(upVoteTotal + 1);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleDeletePost = async (docID) => {
    await deleteDoc(doc(db, "Post", docID));
  };

  const handleNavigateToEditePost = () => {
    navigation.navigate("EditePost", { postData: data });
  };

  const HeaderCard = (
    <HStack justifyContent="space-between" mb={2}>
      <HStack space={2}>
        {isOnCommentScreen && (
          <TouchableOpacity onPress={avatarOnPress}>
            <Avatar
              bg={getRandomColor(userName[0])}
              source={{ uri: userProfile }}
            >
              {userName[0]}
              {isOnline && <Avatar.Badge bg="green.500" />}
            </Avatar>
          </TouchableOpacity>
        )}
        <HStack alignItems="center" space={2}>
          <Text fontSize="lg" style={{ fontFamily: "myFont" }}>
            {userName}
          </Text>
          <Text color="gray.500" fontSize={12}>
            {convertTimeToString(createdAt.seconds)}
          </Text>
        </HStack>
      </HStack>
      <TouchableOpacity onPress={handleOpenModal}>
        <Entypo name="dots-three-horizontal" size={20} color="gray" />
      </TouchableOpacity>
    </HStack>
  );

  return (
    <Stack
      direction={isOnCommentScreen ? "column" : "row"}
      minH={150}
      bg="#FFF"
      px={2}
      py={2}
      space={2}
      borderBottomWidth={1}
      borderBottomColor="gray.100"
    >
      {!isOnCommentScreen && (
        <TouchableOpacity onPress={avatarOnPress}>
          <Avatar
            bg={getRandomColor(userName[0])}
            source={{ uri: userProfile }}
          >
            {userName[0]}
            {isOnline && <Avatar.Badge bg="green.500" />}
          </Avatar>
        </TouchableOpacity>
      )}
      <Box flex={isOnCommentScreen ? 0 : 1}>
        {HeaderCard}
        {data.image ? (
          <VStack space={2}>
            <Text color="gray.500" fontSize="md">
              {text}
            </Text>

            <TouchableOpacity>
              <Image
                source={{
                  uri: image.imageUri,
                }}
                style={{ height: 200, borderRadius: 15 }}
              />
            </TouchableOpacity>
          </VStack>
        ) : (
          <Box borderRadius="15">
            <Text color="gray.500" fontSize="md">
              {text}
            </Text>
          </Box>
        )}

        <HStack space={7} alignItems="center">
          <HStack alignItems="center">
            <IconButton
              variant="ghost"
              borderRadius="full"
              onPress={handleIncrementLike}
              _pressed={{ bg: "gray.100" }}
              _icon={{
                as: isUserAlreadyLike ? Foundation : FontAwesome5,
                name: "heart",
                size: "md",
                color: isUserAlreadyLike ? "red.500" : "gray.400",
                style: { width: 21 },
              }}
            />
            <Text color="gray.400" fontSize={12}>
              {likesTotal}
            </Text>
          </HStack>

          <HStack alignItems="center">
            <IconButton
              variant="ghost"
              borderRadius="full"
              onPress={handleIncrementUpVote}
              _pressed={{ bg: "gray.100" }}
              _icon={{
                as: isUserAlreadyUpVote ? Entypo : MaterialCommunityIcons,
                name: isUserAlreadyUpVote
                  ? "arrow-up"
                  : "arrow-up-bold-outline",
                size: "md",
                color: isUserAlreadyUpVote ? "darkBlue.300" : "gray.400",
              }}
            />
            <Text color="gray.400" fontSize={12}>
              {upVoteTotal}
            </Text>
          </HStack>

          <HStack alignItems="center">
            <IconButton
              variant="ghost"
              onPress={() => navigation.navigate("Comment", { postID })}
              borderRadius="full"
              _pressed={{ bg: "gray.100" }}
              _icon={{
                as: Octicons,
                name: "comment",
                size: "md",
                color: "gray.400",
              }}
            />
            <Text color="gray.400" fontSize={12}>
              {comments.length}
            </Text>
          </HStack>

          <IconButton
            onPress={shareThisApp}
            variant="ghost"
            borderRadius="full"
            _pressed={{ bg: "gray.100" }}
            _icon={{
              as: Feather,
              name: "share-2",
              size: "md",
              color: "gray.400",
            }}
          />
        </HStack>
      </Box>

      <AlertDialogStyle
        isOpen={displayAlert}
        setIsOpen={setDisplayAlert}
        title="Delete Post"
        description="apakah anda yakin ingin menghapus postingan ini"
        onButtonActionPres={() => handleDeletePost(docPostID)}
        buttonTitleAction="Delete"
        buttonTitleCancle="Cancle"
      />

      <ModalStyle isOpen={openModal} onClose={handleOpenModal}>
        {isCurrentUserPost && (
          <>
            <Actionsheet.Item
              onPress={() => {
                handleOpenModal();
              }}
            >
              Ubah Pemirsa
            </Actionsheet.Item>
            <Actionsheet.Item
              onPress={() => {
                handleNavigateToEditePost();
                handleOpenModal();
              }}
            >
              Edit Post
            </Actionsheet.Item>
            <Actionsheet.Item
              onPress={() => {
                handleOpenModal();
                setDisplayAlert(true);
              }}
            >
              Delete Post
            </Actionsheet.Item>
          </>
        )}
        {!isCurrentUserPost && (
          <>
            <Actionsheet.Item>Laporkan</Actionsheet.Item>
            <Actionsheet.Item>Laporkan</Actionsheet.Item>
            <Actionsheet.Item>Laporkan</Actionsheet.Item>
            <Actionsheet.Item>Laporkan</Actionsheet.Item>
          </>
        )}
      </ModalStyle>
    </Stack>
  );
};

export default Card;
