import React, { useRef, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Avatar, NativeBaseProvider } from "native-base";
import { Text, AppState } from "react-native";
import { ContextApi } from "./lib/helper/ContexApi";

import Home from "./screens/home";
import DetailProfile from "./screens/profile";
import Search from "./screens/search";
import Notifications from "./screens/notifications";
import Login from "./screens/auth/Login";
import SignUp from "./screens/auth/SignUp";
import CreatePost from "./screens/createPost";
import Comments from "./screens/comments";
import Welcome from "./screens/auth/Welcome";
import Chat from "./screens/chat";
import MyProfile from "./screens/myProfile";
import Messages from "./screens/chat/components/Messages";
import EditeProfile from "./screens/myProfile/editeProfile";
import EditPost from "./screens/editePost";

import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/config/firebase";
import { db } from "./lib/config/firebase";

import { Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LogBox } from "react-native";
import _ from "lodash";
import Friends from "./screens/friends";
import { useContextApi } from "./lib/hooks/useContexApi";
import { getPost, getUsers } from "./lib/functions/getPost";
import { useFonts } from "expo-font";
import FriendsSuggestion from "./screens/friends/FriendsSuggestion";
import SearchGifs from "./screens/searchGifs";
import LoadingAnimation from "./components/animations/LoadingAnimation";
import { StatusBar } from "expo-status-bar";
import ReplyComment from "./screens/comments/components/ReplyComment";

LogBox.ignoreLogs(["Warning:..."]); // ignore specific log
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

const Stack = createNativeStackNavigator();

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [isDataAvaliable, setIsDataAvaliable] = useState(false);
  const [postCollection, setPostCollection] = useState([]);
  const [usersCollection, setUsersCollection] = useState([]);

  useEffect(() => {
    let unsubscribe = null;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe = onSnapshot(doc(db, "Users", user.email), (docSnap) => {
          setCurrentUserData({ userID: docSnap.id, ...docSnap.data() });
          setIsAuth(true);
        });
      } else {
        setIsDataAvaliable(true);
      }
    });
    return () => unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      const users = await getUsers();
      setUsersCollection(users);

      const posts = await getPost();
      setPostCollection(posts);

      setIsDataAvaliable(true);
    })();
  }, []);

  const [loaded] = useFonts({
    myFont: require("./assets/fonts/myFont.ttf"),
    montSerrat: require("./assets/fonts/Montserrat.ttf"),
  });

  if (!loaded) return null;

  if (!isDataAvaliable) return <LoadingAnimation />;

  return (
    <ContextApi.Provider
      value={{
        postCollection,
        setPostCollection,
        isAuth,
        setIsAuth,
        currentUserData,
        setCurrentUserData,
        usersCollection,
      }}
    >
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerTitleStyle: { fontSize: 17 } }}
          >
            {isAuth ? (
              <>
                <Stack.Screen
                  name="Main"
                  component={TabNavigation}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="DetailProfile" component={DetailProfile} />
                <Stack.Screen name="Search" component={Search} />
                <Stack.Screen name="Notifications" component={Notifications} />
                <Stack.Screen name="CreatePost" component={CreatePost} />
                <Stack.Screen name="EditePost" component={EditPost} />
                <Stack.Screen name="Comment" component={Comments} />
                <Stack.Screen name="ReplyComment" component={ReplyComment} />
                <Stack.Screen name="Messages" component={Messages} />
                <Stack.Screen name="SearchGifs" component={SearchGifs} />
                <Stack.Screen name="EditeProfile" component={EditeProfile} />
                <Stack.Screen
                  name="FriendsSuggestion"
                  component={FriendsSuggestion}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Welcome"
                  component={Welcome}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="SignUp"
                  component={SignUp}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </NativeBaseProvider>
    </ContextApi.Provider>
  );
}

const Tab = createBottomTabNavigator();

function TabNavigation() {
  const { currentUserData } = useContextApi();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: () => null,
        tabBarIcon: ({ color }) => {
          switch (route.name) {
            case "Home":
              return <Feather name="home" size={24} color={color} />;
            case "Chat":
              return (
                <Ionicons name="chatbubble-ellipses" size={24} color={color} />
              );
            case "Friends":
              return (
                <FontAwesome5 name="user-friends" size={24} color={color} />
              );
            case "MyProfile":
              return (
                <Avatar
                  bg="darkBlue.400"
                  size="sm"
                  source={{
                    uri: currentUserData.userProfile,
                  }}
                >
                  {currentUserData.userName[0]}
                </Avatar>
              );
          }
        },
        tabBarActiveTintColor: "dodgerblue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Friends" component={Friends} />
      <Tab.Screen name="MyProfile" component={MyProfile} />
    </Tab.Navigator>
  );
}

export default App;

// const getMergePostAndUserCollection = ({ userData, postData }) => {
//   const result = [];
//   postData.forEach((posts) => {
//     const userInfo = userData.find((user) => user.email === posts.userID);
//     result.push({
//       ...posts,
//       isOnline: userInfo.isOnline,
//       userName: userInfo.userName,
//       userProfile: userInfo.userProfile,
//     });
//   });
//   return result;
// };

// const extractData = (listData) => {
//   const result = [];
//   listData.forEach((doc) => {
//     result.push({ docPostID: doc.id, ...doc.data() });
//   });
//   return result;
// };

// useEffect(() => {
//   const q = query(collection(db, "Post"), orderBy("createdAt", "desc"));
//   const unsubscribe = onSnapshot(q, (querySnapshot) => {
//     const postList = extractData(querySnapshot);
//     getUsers().then((userList) => {
//       const postResult = getMergePostAndUserCollection({
//         userData: userList,
//         postData: postList,
//       });
//       setPostCollection(postResult);
//       setUsersCollection(userList);
//       setIsDataAvaliable(true);
//     });
//   });
//   return () => unsubscribe;
// }, [currentUserData]);
