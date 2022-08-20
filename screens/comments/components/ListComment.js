import React from "react";
import { VStack, Text, HStack, Avatar, Box } from "native-base";
import { TouchableOpacity } from "react-native";
import { useContextApi } from "../../../lib/hooks/useContexApi";
import { getRandomColor } from "../../../lib/functions/getRandomColor";
import { convertTimeToString } from "../../../lib/functions/convertTime";
import { Ionicons } from "@expo/vector-icons";

const ListComment = ({
  comment,
  isOnline,
  onPress,
  isChildList,
  navigateToReplyScreen,
  comentLengthVisible,
}) => {
  const { currentUserData } = useContextApi();
  return (
    <VStack my="2" ml={isChildList ? "16" : "2"} mr="6">
      <HStack space={2}>
        <TouchableOpacity>
          <Avatar bg={getRandomColor(comment.userCreated[0])}>
            {comment.userCreated[0]}
            {isOnline && <Avatar.Badge bg="green.500" />}
          </Avatar>
        </TouchableOpacity>

        <VStack space={2}>
          <TouchableOpacity onLongPress={onPress}>
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
