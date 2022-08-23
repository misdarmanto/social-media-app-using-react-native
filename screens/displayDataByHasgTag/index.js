import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box } from "native-base";
import Card from "../../components/Card";
import { FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import SkeletonCard from "./components/SkeletonCard";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { getPost } from "../../lib/functions/getPost";

export default function PostByHashTag() {
  const {
    currentUserData,
    postCollection,
    setPostCollection,
  } = useContextApi();

  const navigation = useNavigation();
  const { hashTag } = useRoute().params;

  const [isDataAvaliable, setIsDataAvaliable] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [post, setPost] = useState([]);

  const handleOnRefresh = () => {
    setIsDataAvaliable(false);
    setIsRefresh(true);
    getPost()
      .then((data) => setPostCollection(data))
      .then(() => {
        setIsDataAvaliable(true);
        setIsRefresh(false);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: hashTag,
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsDataAvaliable(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (postCollection.length === 0) return;
    const getPostByHashTag = postCollection.filter((post) => {
      if (post.hashTags.includes(hashTag)) {
        return post;
      }
    });
    setPost(getPostByHashTag);
  }, []);

  return isDataAvaliable ? (
    <Box flex={1} bgColor="#FFF">
      <FlatList
        data={post}
        keyExtractor={(item) => item.postID}
        renderItem={({ item }) => (
          <Card
            data={item}
            avatarOnPress={() => {
              if (currentUserData.userID === item.userID) {
                navigation.navigate("MyProfile");
              } else {
                navigation.navigate("DetailProfile", {
                  userTargetID: item.userID,
                });
              }
            }}
          />
        )}
        refreshing={isRefresh}
        onRefresh={handleOnRefresh}
      />
    </Box>
  ) : (
    <Box flex={1} bgColor="#FFF">
      {[1, 2, 3, 4, 5].map((data) => (
        <SkeletonCard key={data} />
      ))}
    </Box>
  );
}
