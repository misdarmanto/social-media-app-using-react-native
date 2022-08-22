import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Box, HStack, Icon, Input, Text, Avatar } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { getRandomColor } from "../../lib/functions/getRandomColor";

export default function Search() {
  const navigation = useNavigation();
  const { usersCollection, currentUserData } = useContextApi();
  const [searchResult, setSearchResult] = useState([]);

  const handleSearch = (value) => {
    if (value === "") {
      setSearchResult([]);
      return;
    }
    const userList = usersCollection.filter(
      (data) => data.userID !== currentUserData.userID
    );
    const regex = userList.filter((data) => {
      if (data.name.toUpperCase().search(value.toUpperCase()) !== -1) {
        return data;
      }
    });
    setSearchResult(regex);
  };

  useEffect(() => {
    const userList = usersCollection.filter(
      (data) => data.userID !== currentUserData.userID
    );
    setSearchResult(userList);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerRight: () => (
        <Input
          w={"85%"}
          borderRadius="full"
          onChangeText={handleSearch}
          InputLeftElement={
            <Icon
              as={<FontAwesome name="search" size={30} color="black" />}
              ize={8}
              ml="5"
              color="muted.400"
            />
          }
          placeholder="Cari..."
          _focus={{ bgColor: "gray.50", borderColor: "gray.300" }}
        />
      ),
    });
  }, []);

  const RenderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DetailProfile", { userTargetID: item.userID })
        }
      >
        <HStack space={5} alignItems="center" mx="2" my="2">
          <Avatar
            bg={getRandomColor(item.name[0])}
            source={{
              uri: item.userProfile,
            }}
          >
            {item.name[0]}
          </Avatar>
          <Text fontSize="md" fontFamily="myFont">
            {item.name}
          </Text>
        </HStack>
      </TouchableOpacity>
    );
  };

  return (
    <Box bg={"#FFF"} flex={1}>
      {Array.isArray(searchResult) && (
        <FlatList
          style={{ paddingTop: 10 }}
          data={searchResult}
          keyExtractor={(item) => item.userID}
          renderItem={({ item }) => <RenderItem item={item} />}
        />
      )}
    </Box>
  );
}
