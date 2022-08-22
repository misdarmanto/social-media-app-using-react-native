import React from "react";
import { VStack, Text, HStack, Avatar, Box } from "native-base";
import { TouchableOpacity } from "react-native";
import { useContextApi } from "../../../lib/hooks/useContexApi";
import { getRandomColor } from "../../../lib/functions/getRandomColor";
import { convertTimeToString } from "../../../lib/functions/convertTime";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ListComment = ({
  comment,
  onPress = () => null,
  isChildList,
  navigateToReplyScreen,
  comentLengthVisible,
  onButtonLikeClick = () => null,
}) => {
  const { currentUserData, usersCollection } = useContextApi();
  const navigation = useNavigation();
  const detailUserComment = usersCollection.find((user) => {
    return user.userID === comment.userCreatedID;
  });

  return (
    <VStack my="2" ml={isChildList ? "16" : "2"} mr="6">
      <HStack space={2}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("DetailProfile", {
              userTargetID: comment.userCreatedID,
            })
          }
        >
          <Avatar bg={getRandomColor(detailUserComment.name[0])}>
            {detailUserComment.name[0]}
            {detailUserComment.isOnline && <Avatar.Badge bg="green.500" />}
          </Avatar>
        </TouchableOpacity>

        <VStack space={2}>
          <TouchableOpacity
            onPress={() => {
              if (comment.userCreatedID === currentUserData.userID) {
                onPress();
              } else {
                return;
              }
            }}
          >
            <Box
              bgColor={
                comment.userCreatedID === currentUserData.userID
                  ? "darkBlue.400"
                  : "coolGray.100"
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
                fontFamily="myFont"
              >
                {detailUserComment.name}
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
            <TouchableOpacity onPress={onButtonLikeClick}>
              <Text color="gray.700" fontSize={12}>
                Suka
              </Text>
            </TouchableOpacity>
            {!isChildList && (
              <TouchableOpacity onPress={navigateToReplyScreen}>
                <Text color="gray.700" fontSize={12}>
                  Balas
                </Text>
              </TouchableOpacity>
            )}
            {comment.commentLikes.length !== 0 && (
              <HStack alignItems="center">
                <Ionicons
                  name="heart-circle-sharp"
                  size={25}
                  color="dodgerblue"
                />
                <Text color="gray.700" fontSize={12}>
                  {comment.commentLikes.length}
                </Text>
              </HStack>
            )}
          </HStack>
          {Array.isArray(comment.commentReply) &&
            comment.commentReply.length !== 0 &&
            comentLengthVisible && (
              <TouchableOpacity onPress={navigateToReplyScreen}>
                <Text fontFamily="myFont" fontSize="xs">
                  Lihat {comment.commentReply.length} balasan
                </Text>
              </TouchableOpacity>
            )}
        </VStack>
      </HStack>
    </VStack>
  );
};

export default ListComment;
