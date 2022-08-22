import React, { useEffect, useRef, useState } from "react";
import { VStack, Text, Input, IconButton, HStack, Modal } from "native-base";
import { Keyboard, TouchableOpacity, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Card from "../../components/Card";
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import {
  doc,
  arrayUnion,
  Timestamp,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { useContextApi } from "../../lib/hooks/useContexApi";
import uuid from "react-native-uuid";
import LoadingAnimation from "../../components/animations/LoadingAnimation";
import ListComment from "./components/ListComment";

export default function Comments() {
  const { data } = useRoute().params;
  const navigation = useNavigation();
  const { currentUserData } = useContextApi();
  const flatListRef = useRef();

  const [commentText, setCommentText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [commentSelectedID, setCommentSelectedID] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [isDataAvaliable, setIsDataAvaliable] = useState(false);
  const [submitName, setSubmitName] = useState("");

  useEffect(() => {
    const docRef = doc(db, "Post", data.docPostID);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      setCurrentPost({ ...data, ...docSnap.data() });
      setIsDataAvaliable(true);
    });
    return () => unsubscribe;
  }, []);

  const handleSendComment = async () => {
    const commentData = {
      commentID: uuid.v4(),
      text: commentText,
      commentLikes: [],
      commentReply: [],
      createdAt: Timestamp.now(),
      userCreatedID: currentUserData.userID,
    };

    const docPostRef = doc(db, "Post", currentPost.docPostID);
    await updateDoc(docPostRef, {
      comments: arrayUnion(commentData),
    });
    setSubmitName("")
  };

  const handleReplyCommentButtonOnPress = (commentID) => {
    const getComment = currentPost.comments.find((comment) => {
      return comment.commentID === commentID;
    });
    navigation.navigate("ReplyComment", {
      data: getComment,
      currentPost,
    });
  };

  const getCurrentIndexComment = (commentID) => {
    const allCommentID = currentPost.comments.map((comment) => {
      return comment.commentID;
    });
    return allCommentID.indexOf(commentID);
  };

  const handleUpdateComment = () => {
    const indexComment = getCurrentIndexComment(commentSelectedID);
    const commentData = currentPost.comments[indexComment];
    setCommentText(commentData.text);
    setSubmitName("update");
  };

  const handleSendUpdatedComment = async () => {
    const indexComment = getCurrentIndexComment(commentSelectedID);
    currentPost.comments[indexComment].text = commentText;

    const docPostRef = doc(db, "Post", currentPost.docPostID);
    await updateDoc(docPostRef, {
      comments: currentPost.comments,
    });
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

  const handleLikeComment = async (commentID) => {
    if (!Array.isArray(currentPost.comments)) return;
    const newComments = currentPost.comments.find((comment) => {
      return comment.commentID === commentID;
    });

    if (!Array.isArray(newComments.commentLikes)) return;
    const isAlreadyCLiked = newComments.commentLikes.includes(
      currentUserData.userID
    );
    if (isAlreadyCLiked) {
      const newCommentLikes = newComments.commentLikes.filter((userLikeID) => {
        return userLikeID !== currentUserData.userID;
      });
      newComments.commentLikes = newCommentLikes;
    } else {
      newComments.commentLikes.push(currentUserData.userID);
    }

    const indexComment = getCurrentIndexComment(commentID);
    currentPost.comments[indexComment] = newComments;

    const docPostRef = doc(db, "Post", currentPost.docPostID);
    await updateDoc(docPostRef, {
      comments: currentPost.comments,
    });
  };

  const handleSubmitComment = () => {
    if (commentText.length >= 200) return;

    switch (submitName) {
      case "update":
        handleSendUpdatedComment();
        break;
      default:
        handleSendComment();
        break;
    }

    Keyboard.dismiss();
    setCommentText("");
    setSubmitName("")
    flatListRef.current.scrollToEnd();
  };

  const handleCloseModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    if (!isDataAvaliable) return;
    navigation.setOptions({
      title: `Postingan ${currentPost.name}`,
    });
  }, [isDataAvaliable]);

  if (!isDataAvaliable) return <LoadingAnimation />;

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
    <ListComment
      isOnline={currentPost.isOnline}
      comment={comment}
      onButtonLikeClick={() => handleLikeComment(comment.commentID)}
      comentLengthVisible={true}
      navigateToReplyScreen={() =>
        handleReplyCommentButtonOnPress(comment.commentID)
      }
      onPress={() => {
        setOpenModal(true);
        setCommentSelectedID(comment.commentID);
      }}
    />
  );

  return (
    <VStack flex={1} bgColor={"#FFF"}>
      {Array.isArray(currentPost.comments) && (
        <FlatList
          ref={flatListRef}
          ListHeaderComponent={<RenderCommentsListHeader />}
          data={currentPost.comments}
          keyExtractor={(item) => item.commentID}
          renderItem={({ item }) => <RenderCommentsList comment={item} />}
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
                  handleDeleteComment();
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
                  handleUpdateComment();
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
          placeholder="Tulis komentar..."
          fontSize="md"
          focusable
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
