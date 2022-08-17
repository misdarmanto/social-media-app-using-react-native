import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  VStack,
  Text,
  ScrollView,
  Input,
  IconButton,
  HStack,
  Avatar,
  Box,
} from "native-base";

import { Keyboard, TouchableOpacity, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Card from "../../components/Card";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";

import {
  doc,
  arrayUnion,
  Timestamp,
  updateDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { getRandomColor } from "../../lib/functions/getRandomColor";
import { convertTimeToString } from "../../lib/functions/convertTime";
import ModalStyle from "../../components/ModalStyle";

import uuid from "react-native-uuid";

export default function Comments() {
  const { postID } = useRoute().params;
  const navigation = useNavigation();
  const { currentUserData, postCollection } = useContextApi();

  const [commentText, setCommentText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [commentSelectedID, setCommentSelectedID] = useState([]);
  const [iscommentUpdated, setIsCommentUpdated] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const [isDataAvaliable, setIsDataAvaliable] = useState(false);

  const getCurrentPost = () => {
    return postCollection.find((value) => value.postID === postID);
  };

  useEffect(() => {
    const postList = getCurrentPost();
    setCurrentPost(postList);
    setIsDataAvaliable(true);
  }, [postCollection]);

  // useEffect(() => {
  //   const collRef = collection(db, "Post", currentPost.docPostID, "Comments");
  //   const q = query(collRef);
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     const result = [];
  //     querySnapshot.forEach((doc) => {
  //         result.push(doc.data());
  //     });
  //     console.log(result);
  //   });

  //   return () =>  unsubscribe;
  // }, [])

  const handleSendComment = async () => {
    const commentData = {
      commentID: uuid.v4(),
      text: commentText,
      commentLikes: [],
      commentReply: [],
      createdAt: Timestamp.now(),
      userCreated: currentUserData.userName,
      userCreatedID: currentUserData.userID,
    };

    const docPostRef = doc(db, "Post", currentPost.docPostID);
    await updateDoc(docPostRef, {
      comments: arrayUnion(commentData),
    });

    // const collRef = collection(db, "Post", currentPost.docPostID, "Comments");
    // await addDoc(collRef, commentData);
  };

  const handleUpdateComment = () => {
    const allCommentID = currentPost.comments.map(
      (comment) => comment.commentID
    );
    const commentIndex = allCommentID.indexOf(commentSelectedID);
    const commentData = currentPost.comments[commentIndex];
    setCommentText(commentData.text);
    setIsCommentUpdated(true);
  };

  const handleSendUpdatedComment = async () => {
    const allCommentID = currentPost.comments.map(
      (comment) => comment.commentID
    );
    const commentIndex = allCommentID.indexOf(commentSelectedID);
    currentPost.comments[commentIndex].text = commentText;

    const docPostRef = doc(db, "Post", currentPost.docPostID);
    await updateDoc(docPostRef, {
      comments: currentPost.comments,
    });
    setIsCommentUpdated(false);
  };

  const handleDeleteComment = async () => {
    const newComments = currentPost.comments.filter((comment) => {
      return comment.commentID !== commentSelectedID;
    });

    const docPostRef = doc(db, "Post", currentPost.docPostID);
    await updateDoc(docPostRef, {
      comments: newComments,
    });
  };

  const handleSubmitComment = () => {
    if (commentText.length >= 200) return;

    if (iscommentUpdated) {
      handleSendUpdatedComment();
    } else {
      handleSendComment();
    }
    setCommentText("");
    Keyboard.dismiss();
  };

  const handleCloseModal = () => {
    setOpenModal(!openModal);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Postingan ${currentPost.userName}`,
    });
  }, []);

  if (!isDataAvaliable) return <Text>loading...</Text>;

  const RenderCommentsListHeader = () => (
    <>
      <Card data={currentPost} isOnCommentScreen />
      {Array.isArray(currentPost.comments) &&
        currentPost.comments.length === 0 && (
          <VStack alignItems="center" space={2} mt="10">
            <FontAwesome
              name="comments"
              size={50}
              color="gray"
              style={{ width: 60 }}
            />
            <Text color="gray.500">Belum ada komentar</Text>
          </VStack>
        )}
    </>
  );

  const RenderCommentsList = ({ comment }) => (
    <VStack my="2" mx="2">
      <HStack space={2}>
        <TouchableOpacity>
          <Avatar bg={getRandomColor(comment.userCreated[0])}>
            {comment.userCreated[0]}
            {true && <Avatar.Badge bg="green.500" />}
          </Avatar>
        </TouchableOpacity>

        <VStack space={2}>
          <TouchableOpacity
            onLongPress={() => {
              setOpenModal(true);
              setCommentSelectedID(comment.commentID);
            }}
          >
            <Box
              bgColor={
                comment.userCreatedID === currentUserData.userID
                  ? "darkBlue.400"
                  : "gray.100"
              }
              px={"5"}
              py="1"
              borderRadius="2xl"
              mr="10"
            >
              <Text
                color={
                  comment.userCreatedID === currentUserData.userID
                    ? "#FFF"
                    : "gray.500"
                }
              >
                {comment.userCreated}
              </Text>
              <Text
                style={{ fontSize: 13 }}
                color={
                  comment.userCreatedID === currentUserData.userID
                    ? "#FFF"
                    : "gray.500"
                }
              >
                {comment.text}
              </Text>
            </Box>
          </TouchableOpacity>
          <HStack pl={2} space={5}>
            <Text color="gray.500" fontSize={10}>
              {convertTimeToString(comment.createdAt.seconds)}
            </Text>
            <TouchableOpacity>
              <Text color="gray.700" fontSize={12}>
                Suka
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text color="gray.700" fontSize={12}>
                Balas
              </Text>
            </TouchableOpacity>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );

  return (
    <VStack flex={1} bgColor={"#FFF"}>
      {Array.isArray(currentPost.comments) && (
        <FlatList
          ListHeaderComponent={<RenderCommentsListHeader />}
          data={currentPost.comments}
          keyExtractor={(item) => item.commentID}
          renderItem={({ item }) => <RenderCommentsList comment={item} />}
        />
      )}
      <ModalStyle
        isOpen={openModal}
        onClose={handleCloseModal}
        placement="center"
      >
        <VStack space={"5"}>
          <TouchableOpacity
            onPress={() => {
              handleCloseModal();
              handleDeleteComment();
            }}
          >
            <Text>Hapus</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleCloseModal();
              handleUpdateComment();
            }}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
        </VStack>
      </ModalStyle>
      <HStack borderTopWidth={1} borderColor="gray.200">
        <Input
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Tulis komentar..."
          fontSize="md"
          borderColor="#FFF"
          px={"5"}
          flex={2}
          _focus={{ borderColor: "#FFF", bgColor: "gray.100" }}
          borderRadius="full"
          InputRightElement={
            <TouchableOpacity>
              <IconButton
                onPress={handleSubmitComment}
                variant="ghost"
                isDisabled={commentText === ""}
                _icon={{
                  as: Ionicons,
                  name: "send",
                  size: "xl",
                  color: "darkBlue.400",
                }}
              />
            </TouchableOpacity>
          }
        />
      </HStack>
    </VStack>
  );
}
