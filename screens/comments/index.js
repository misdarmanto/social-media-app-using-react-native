import React, { useEffect, useRef, useState } from "react";
import { VStack, Text, Input, IconButton, HStack } from "native-base";
import { Keyboard, TouchableOpacity, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Card from "../../components/Card";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  doc,
  arrayUnion,
  Timestamp,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { useContextApi } from "../../lib/hooks/useContexApi";
import ModalStyle from "../../components/ModalStyle";
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
      userCreated: currentUserData.userName,
      userCreatedID: currentUserData.userID,
    };

    const docPostRef = doc(db, "Post", currentPost.docPostID);
    await updateDoc(docPostRef, {
      comments: arrayUnion(commentData),
    });
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

  const handleUpdateComment = () => {
    const allCommentID = currentPost.comments.map(
      (comment) => comment.commentID
    );
    const commentIndex = allCommentID.indexOf(commentSelectedID);
    const commentData = currentPost.comments[commentIndex];
    setCommentText(commentData.text);
    setSubmitName("update");
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

    switch (submitName) {
      case "update":
        handleSendUpdatedComment();
        break;
      default:
        handleSendComment();
        break;
    }

    setCommentText("");
    flatListRef.current.scrollToEnd();
    Keyboard.dismiss();
  };

  const handleCloseModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    if (!isDataAvaliable) return;
    navigation.setOptions({
      title: `Postingan ${currentPost.userName}`,
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
    <>
      <ListComment
        isOnline={currentPost.isOnline}
        comment={comment}
        comentLengthVisible
        navigateToReplyScreen={() =>
          handleReplyCommentButtonOnPress(comment.commentID)
        }
        onPress={() => {
          setOpenModal(true);
          setCommentSelectedID(comment.commentID);
        }}
      />
    </>
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
      <ModalStyle isOpen={openModal} onClose={handleCloseModal}>
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
      </ModalStyle>
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
