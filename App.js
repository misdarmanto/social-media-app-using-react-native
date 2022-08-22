import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Avatar, NativeBaseProvider } from "native-base";
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

import { doc, onSnapshot } from "firebase/firestore";
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
import PostByHashTag from "./screens/displayDataByHasgTag";

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
  const [allUserNameTags, setAllUserNameTags] = useState([]);

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

      const allUserNames = users.map((user) => user.userName);
      setAllUserNameTags(allUserNames);

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
    <NativeBaseProvider>
      <ContextApi.Provider
        value={{
          postCollection,
          setPostCollection,
          allUserNameTags,
          isAuth,
          setIsAuth,
          currentUserData,
          setCurrentUserData,
          usersCollection,
        }}
      >
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
                <Stack.Screen name="PostByHashTag" component={PostByHashTag} />
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
      </ContextApi.Provider>
    </NativeBaseProvider>
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
                  {currentUserData.name[0]}
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
