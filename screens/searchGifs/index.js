import React, { useEffect, useLayoutEffect, useState } from "react";
import { Image, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { Icon, Input, Box, Stack } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import { fetchGifs } from "../../lib/functions/fetchGifs";
import uuid from "react-native-uuid";

export default function SearchGifs() {
  const navigation = useNavigation();
  const [searchGifsResult, setSearchGifsResult] = useState([]);

  const handleSearch = async (value) => {
    // if (value === "") return;
    // const gifs = await fetchGifs(value);
    // setSearchGifsResult(gifs);
  };

  // useEffect(() => {
  //   (async () => {
  //     const gifs = await fetchGifs("hello");
  //     setSearchGifsResult(gifs);
  //     console.log(result[0]);
  //   })();
  // }, []);

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
      <TouchableOpacity>
        <Image
          source={{ uri: item.images.original.url }}
          style={{ height: 110, width: 130 }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Box bg={"#FFF"} flex={1}>
      <ScrollView>
        <Stack direction="row" flexWrap="wrap" space={1}>
          {Array.isArray(searchGifsResult) &&
            searchGifsResult.map((item, index) => (
              <RenderItem key={index} item={item} />
            ))}
        </Stack>
      </ScrollView>
    </Box>
  );
}
