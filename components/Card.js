import React, { useEffect, useState } from "react";
import {
  Box,
  HStack,
  Avatar,
  VStack,
  Text,
  IconButton,
  Stack,
  Actionsheet,
} from "native-base";
import {
  Entypo,
  Octicons,
  MaterialCommunityIcons,
  Foundation,
  Feather,
  FontAwesome5,
  MaterialIcons,
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
  collection,
  setDoc,
} from "firebase/firestore";
import { db } from "../lib/config/firebase";
import { useContextApi } from "../lib/hooks/useContexApi";
import AlertDialogStyle from "./AlertDialogStyle";
import ModalStyle from "./ModalStyle";
import { shareThisApp } from "../lib/functions/shareThisApp";
import { formatStringLength } from "../lib/functions/formatString";
import { getPost } from "../lib/functions/getPost";

const Card = ({ data, avatarOnPress, isOnCommentScreen }) => {
  const {
    name,
    userName,
    userProfile,
    createdAt,
    text,
    likes,
    comments,
    isOnline,
    image,
    docPostID,
    userID,
    upVote,
    tags,
    hashTags,
    isVerified,
  } = data;
  const navigation = useNavigation();
  const { currentUserData, setPostCollection } = useContextApi();
  const isCurrentUserPost = currentUserData.userID === userID;
  const commentTotal =
    comments
      .map((value) => value.commentReply.length)
      .reduce((total, value) => total + value, 0) + comments.length;

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

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const handleDeletePost = async (docID) => {
    await deleteDoc(doc(db, "Post", docID));
    getPost().then((data) => setPostCollection(data));
  };

  const handleNavigateToEditePost = () => {
    navigation.navigate("EditePost", { postData: data });
  };

  const handleReportPost = async (message) => {
    const data = {
      reporter: currentUserData.userID,
      reported: userID,
      message: message,
      postID: docPostID,
    };
    const reportPost = doc(collection(db, "ReportPost"));
    await setDoc(reportPost, data);
  };

  const HeaderCard = (
    <HStack justifyContent="space-between" mb={2} alignItems="center">
      <HStack space={2}>
        {isOnCommentScreen && (
          <TouchableOpacity onPress={avatarOnPress}>
            <Avatar bg={getRandomColor(name[0])} source={{ uri: userProfile }}>
              {name[0]}
              {isOnline && <Avatar.Badge bg="green.500" />}
            </Avatar>
          </TouchableOpacity>
        )}
        <HStack alignItems="center" space={1}>
          <Text fontSize="lg" style={{ fontFamily: "myFont" }}>
            {name}
          </Text>
          {isVerified && (
            <MaterialIcons name="verified" size={18} color="dodgerblue" />
          )}
          <Text color="gray.500" fontSize={12}>
            {formatStringLength(userName)}
          </Text>
          <Text color="gray.500" fontSize={12}>
            {convertTimeToString(createdAt.seconds)}
          </Text>
        </HStack>
      </HStack>
      <TouchableOpacity onPress={handleModal}>
        <Entypo name="dots-three-horizontal" size={20} color="gray" />
      </TouchableOpacity>
    </HStack>
  );

  return (
    <Stack
      direction={isOnCommentScreen ? "column" : "row"}
      bg="#FFF"
      px={2}
      py={2}
      space={2}
      borderBottomWidth={1}
      borderBottomColor="gray.100"
    >
      {!isOnCommentScreen && (
        <TouchableOpacity onPress={avatarOnPress}>
          <Avatar bg={getRandomColor(name[0])} source={{ uri: userProfile }}>
            {name[0]}
            {isOnline && <Avatar.Badge bg="green.500" />}
          </Avatar>
        </TouchableOpacity>
      )}
      <Box flex={isOnCommentScreen ? 0 : 1}>
        {HeaderCard}
        {data.image ? (
          <VStack space={2} mb={2}>
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

        <HStack flexWrap="wrap" space={2}>
          {tags.map((value, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate("DetailProfile", {
                  userTargetID: value.userID,
                })
              }
            >
              <Text color="darkBlue.500">{value.tag}</Text>
            </TouchableOpacity>
          ))}
        </HStack>

        <HStack flexWrap="wrap" space={2}>
          {hashTags.map((hashTag, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate("PostByHashTag", {
                  hashTag: hashTag,
                })
              }
            >
              <Text color="darkBlue.500">{hashTag}</Text>
            </TouchableOpacity>
          ))}
        </HStack>

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
              onPress={() => navigation.navigate("Comment", { data })}
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
              {commentTotal}
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

      <ModalStyle isOpen={openModal} onClose={handleModal}>
        {isCurrentUserPost && (
          <>
            <Actionsheet.Item
              onPress={() => {
                handleModal();
              }}
            >
              Ubah Pemirsa
            </Actionsheet.Item>
            <Actionsheet.Item
              onPress={() => {
                handleNavigateToEditePost();
                handleModal();
              }}
            >
              Edit Post
            </Actionsheet.Item>
            <Actionsheet.Item
              onPress={() => {
                handleModal();
                setDisplayAlert(true);
              }}
            >
              Delete Post
            </Actionsheet.Item>
          </>
        )}
        {!isCurrentUserPost && (
          <>
            <Actionsheet.Item
              onPress={() => {
                handleModal();
                handleReportPost("Ini adalah spam");
              }}
            >
              Ini adalah spam
            </Actionsheet.Item>
            <Actionsheet.Item
              onPress={() => {
                handleModal();
                handleReportPost("Saya tidak menyukainya");
              }}
            >
              Saya tidak menyukainya
            </Actionsheet.Item>
            <Actionsheet.Item
              onPress={() => {
                handleModal();
                handleReportPost("Ujaran atau simbol kebencian");
              }}
            >
              Ujaran atau simbol kebencian
            </Actionsheet.Item>
            <Actionsheet.Item
              onPress={() => {
                handleModal();
                handleReportPost("Ketelanjangan atau aktivitas seksual");
              }}
            >
              Ketelanjangan atau aktivitas seksual
            </Actionsheet.Item>
            <Actionsheet.Item
              onPress={() => {
                handleModal();
                handleReportPost("Informasi palsu");
              }}
            >
              Informasi palsu
            </Actionsheet.Item>
            <Actionsheet.Item
              onPress={() => {
                handleModal();
                handleReportPost("Lainya");
              }}
            >
              Lainya
            </Actionsheet.Item>
          </>
        )}
      </ModalStyle>
    </Stack>
  );
};

export default Card;
