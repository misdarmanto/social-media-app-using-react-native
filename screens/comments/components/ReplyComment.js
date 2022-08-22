import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  HStack,
  IconButton,
  Input,
  VStack,
  Text,
  Modal,
} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlatList, Keyboard, TouchableOpacity } from "react-native";
import ListComment from "./ListComment";
import { useContextApi } from "../../../lib/hooks/useContexApi";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/config/firebase";
import uuid from "react-native-uuid";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";

const ReplyComment = () => {
  const navigation = useNavigation();
  const { currentUserData } = useContextApi();
  const { data, currentPost } = useRoute().params;
  const flatListRef = useRef();

  const [commentText, setCommentText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [commentReplySelectedID, setCommentReplySelectedID] = useState(null);
  const [submitName, setSubmitName] = useState("");

  const handleCloseModal = () => {
    setOpenModal(!openModal);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Balas`,
    });
  }, []);

  const getCurrentIndexComment = (commentID) => {
    const allCommentID = currentPost.comments.map((comment) => {
      return comment.commentID;
    });
    return allCommentID.indexOf(commentID);
  };

  const handleSendCommentReply = async () => {
    setSubmitName("");
    if (!Array.isArray(data.commentReply)) return;
    const commentReplyData = {
      commentReplyID: uuid.v4(),
      text: commentText,
      commentLikes: [],
      createdAt: Timestamp.now(),
      userCreatedID: currentUserData.userID,
    };

    data.commentReply.push(commentReplyData);
    const commentIndex = getCurrentIndexComment(data.commentID);
    currentPost.comments[commentIndex] = data;

    const docPostRef = doc(db, "Post", currentPost.docPostID);
    await updateDoc(docPostRef, {
      comments: currentPost.comments,
    });
    Keyboard.dismiss();
    flatListRef.current.scrollToEnd();
    setCommentText("");
    setSubmitName("");
  };

  const handleDeleteCommentReply = async () => {
    if (!Array.isArray(data.commentReply)) return;
    const newCommentReply = data.commentReply.filter((commentReply) => {
      return commentReply.commentReplyID !== commentReplySelectedID;
    });
    const commentIndex = getCurrentIndexComment(data.commentID);
    currentPost.comments[commentIndex].commentReply = newCommentReply;

    const docPostRef = doc(db, "Post", currentPost.docPostID);
    await updateDoc(docPostRef, {
      comments: currentPost.comments,
    });
  };

  const handleLikeCommentReply = async (commentID) => {
    if (!Array.isArray(data.commentReply)) return;
    const allCommentReplyID = data.commentReply.map((comment) => {
      return comment.commentReplyID;
    });
    const indexCommentReply = allCommentReplyID.indexOf(commentID);
    const newCommentReply = data.commentReply[indexCommentReply];

    if (!Array.isArray(newCommentReply.commentLikes)) return;
    const isAlreadyCLiked = newCommentReply.commentLikes.includes(
      currentUserData.userID
    );
    if (isAlreadyCLiked) {
      const newData = newCommentReply.commentLikes.filter((userLikeID) => {
        return userLikeID !== currentUserData.userID;
      });
      newCommentReply.commentLikes = newData;
    } else {
      newCommentReply.commentLikes.push(currentUserData.userID);
    }

    data.commentReply[indexCommentReply] = newCommentReply;
    const indexComment = getCurrentIndexComment(data.commentID);
    currentPost.comments[indexComment] = data;

    const docPostRef = doc(db, "Post", currentPost.docPostID);
    await updateDoc(docPostRef, {
      comments: currentPost.comments,
    });
  };

  const handleSelectCommentReply = () => {
    const allCommentReplyID = data.commentReply.map((comment) => {
      return comment.commentReplyID;
    });
    const indexCommentReply = allCommentReplyID.indexOf(commentReplySelectedID);
    const newCommentReply = data.commentReply[indexCommentReply];
    setCommentText(newCommentReply.text);
    setSubmitName("update");
  };

  const handleEditCommentReply = async () => {
    const allCommentReplyID = data.commentReply.map((comment) => {
      return comment.commentReplyID;
    });
    const indexCommentReply = allCommentReplyID.indexOf(commentReplySelectedID);
    data.commentReply[indexCommentReply].text = commentText;

    const indexComment = getCurrentIndexComment(data.commentID);
    currentPost.comments[indexComment] = data;

    const docPostRef = doc(db, "Post", currentPost.docPostID);
    await updateDoc(docPostRef, {
      comments: currentPost.comments,
    });
    Keyboard.dismiss();
    flatListRef.current.scrollToEnd();
    setCommentText("");
    setSubmitName("");
  };

  const handleSubmit = () => {
    switch (submitName) {
      case "update":
        handleEditCommentReply();
        break;
      default:
        handleSendCommentReply();
        break;
    }
    setSubmitName("");
    setCommentText("")
  };

  const RenderHeaderList = () => {
    return <ListComment comment={data} />;
  };

  return (
    <Box flex={1} bgColor="#FFF">
      {Array.isArray(data.commentReply) && (
        <FlatList
          ref={flatListRef}
          ListHeaderComponent={<RenderHeaderList />}
          data={data.commentReply}
          keyExtractor={(item) => item.commentReplyID}
          renderItem={({ item }) => (
            <ListComment
              comment={item}
              isChildList={true}
              onPress={() => {
                setOpenModal(true);
                setCommentReplySelectedID(item.commentReplyID);
              }}
              onButtonLikeClick={() =>
                handleLikeCommentReply(item.commentReplyID)
              }
            />
          )}
        />
      )}
      <Modal isOpen={openModal} onClose={handleCloseModal} size="lg">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Body>
            <VStack space={5}>
              <TouchableOpacity
                onPress={() => {
                  handleCloseModal();
                  handleDeleteCommentReply();
                }}
              >
                <HStack alignItems="center" space={2}>
                  <MaterialIcons name="delete" size={24} color="gray" />
                  <Text>Hapus</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCloseModal();
                  handleSelectCommentReply();
                }}
              >
                <HStack alignItems="center" space={2}>
                  <AntDesign name="edit" size={24} color="gray" />
                  <Text>Edit</Text>
                </HStack>
              </TouchableOpacity>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <HStack borderTopWidth={1} borderColor="gray.200">
        <Input
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Balas komentar..."
          fontSize="md"
          autoFocus
          borderColor="#FFF"
          px={"5"}
          flex={2}
          _focus={{ borderColor: "#FFF", bgColor: "gray.100" }}
          borderRadius="full"
          InputRightElement={
            <TouchableOpacity>
              <IconButton
                onPress={handleSubmit}
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
    </Box>
  );
};

export default ReplyComment;
