import React, { useLayoutEffect, useRef, useState } from "react";
import { Box, HStack, IconButton, Input } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlatList, Keyboard, TouchableOpacity } from "react-native";
import ListComment from "./ListComment";
import { useContextApi } from "../../../lib/hooks/useContexApi";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/config/firebase";
import uuid from "react-native-uuid";
import { Ionicons } from "@expo/vector-icons";

const ReplyComment = () => {
  const navigation = useNavigation();
  const { currentUserData } = useContextApi();
  const { data, currentPost } = useRoute().params;
  const flatListRef = useRef();

  const [commentText, setCommentText] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Balas`,
    });
  }, []);

  const handleSendCommentReply = async () => {
    const commentReplyData = {
      commentID: uuid.v4(),
      text: commentText,
      commentLikes: [],
      createdAt: Timestamp.now(),
      userCreated: currentUserData.userName,
      userCreatedID: currentUserData.userID,
    };

    const allCommentID = currentPost.comments.map((comment) => {
      return comment.commentID;
    });
    data.commentReply.push(commentReplyData);
    const commentIndex = allCommentID.indexOf(data.commentID);
    currentPost.comments[commentIndex] = data;

    const docPostRef = doc(db, "Post", currentPost.docPostID);
    await updateDoc(docPostRef, {
      comments: currentPost.comments,
    });
    Keyboard.dismiss();
    flatListRef.current.scrollToEnd();
    setCommentText("");
  };

  const RenderHeaderList = () => {
    return <ListComment comment={data} />;
  };

  return (
    <Box flex={1} bgColor="#FFF">
      <FlatList
        ref={flatListRef}
        ListHeaderComponent={<RenderHeaderList />}
        data={data.commentReply}
        keyExtractor={(item) => item.commentID}
        renderItem={({ item }) => (
          <ListComment comment={item} isChildList={true} />
        )}
      />

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
                onPress={handleSendCommentReply}
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
