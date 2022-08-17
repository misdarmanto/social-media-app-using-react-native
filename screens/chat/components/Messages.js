import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  doc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/config/firebase";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { useContextApi } from "../../../lib/hooks/useContexApi";
import { KeyboardAvoidingView, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getRandomColor } from "../../../lib/functions/getRandomColor";
import { Avatar, Box } from "native-base";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [isDataAvaliable, setIsDataAvaliable] = useState(true);

  const { currentUserData } = useContextApi();
  const { userSenderData } = useRoute().params;
  const navigation = useNavigation();

  const handleSaveChatRefrence = async () => {
    const docRefTargetUser = doc(db, "Users", userSenderData.userID);
    const docRefCurrentUser = doc(db, "Users", currentUserData.userID);

    await updateDoc(docRefTargetUser, {
      chatList: arrayUnion({
        docRef: userSenderData.docRef,
        collRef: userSenderData.collRef,
        userSenderID: currentUserData.userID,
      }),
    });

    await updateDoc(docRefCurrentUser, {
      chatList: arrayUnion({
        docRef: userSenderData.docRef,
        collRef: userSenderData.collRef,
        userSenderID: userSenderData.userID,
      }),
    });
  };

  useEffect(() => {
    handleSaveChatRefrence();
  }, []);

  const collRef = collection(
    db,
    "Chats",
    userSenderData.docRef,
    userSenderData.collRef
  );

  useEffect(() => {
    const q = query(collRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result = snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        };
      });
      setMessages(result);
      setIsDataAvaliable(true);
    });

    return () => unsubscribe;
  }, []);

  const onSend = useCallback(async (msg = []) => {
    const { _id, createdAt, text, user } = msg[0];
    await addDoc(collRef, {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: userSenderData.userName,
      headerRight: () => (
        <Avatar
          bg={getRandomColor(userSenderData.userName[0])}
          source={{ uri: userSenderData.userProfile }}
          size="md"
        >
          {userSenderData.userName[0]}
          {userSenderData.isOnline && <Avatar.Badge bg="green.500" />}
        </Avatar>
      ),
    });
  }, []);

  return (
    <Box style={{ flex: 1 }}>
      {isDataAvaliable ? (
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={true}
          onSend={(msg) => {
            onSend(msg);
          }}
          user={{ _id: currentUserData.userID }}
          renderAvatar={null}
          renderBubble={(props) => {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  left: {
                    backgroundColor: "#e3e3e3",
                  },
                }}
              />
            );
          }}
        />
      ) : (
        <Text>Loading...</Text>
      )}
      <KeyboardAvoidingView />
    </Box>
  );
}
