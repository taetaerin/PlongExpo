import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from "@expo/vector-icons/Ionicons";

import Home from "./screens/Home";
import Post from "./screens/Post";
import Participant from "./screens/Participant";
import ParContent from "./screens/components/Participant/ParContent";
import Map from "./screens/Map";
import Profile from "./screens/Profile";

import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";

import app from "./firebase";
import EditProfile from "./screens/components/EditProfile";
import PostContent from "./screens/components/Post/PostContent";
import PostUpdate from "./screens/components/Post/PostUpdate";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import { LogBox } from "react-native";
import PostEdit from "./screens/components/Post/PostEdit";
import CommentInput from "./screens/components/Post/CommentInput";
import HomeContent from "./screens/components/Home/HomeContent";
import CommentContainer from "./screens/components/Post/CommentContainer";
import ParUpdate from "./screens/components/Participant/ParUpdate";

LogBox.ignoreLogs(["Possible Unhandled Promise Rejection"]);

//경고문 무시하기
LogBox.ignoreAllLogs();

export default function App() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // 사용자가 로그인한 경우에만 isLoggedIn를 true로 설정
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const ProfileWithProps = (props) => {
    return <Profile {...props} user={user} />;
  };

  const EditProfileWithProps = (props) => {
    return <EditProfile {...props} user={user} />;
  };

  const PostUpdateWithProps = (props) => {
    return <PostUpdate {...props} user={user} />;
  };

  const SignUpWithProps = (props) => {
    return <SignUp {...props} user={user} />;
  };

  const CommentContainerWithProps = (props) => {
    return <CommentContainer {...props} user={user} />;
  };

  const CommentInputWithProps = (props) => {
    return <CommentInput {...props} user={user} />;
  };

  //하단바 생성
  const BottomTabScreens = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          headerShown: false,

          tabBarIcon: ({ focused, size, color }) => {
            let iconName;
            if (route.name == "Home") {
              iconName = focused ? "home-sharp" : "home-outline";
            } else if (route.name == "Post") {
              iconName = focused ? "create-sharp" : "create-outline";
            } else if (route.name == "Participant") {
              iconName = focused
                ? "ios-megaphone-sharp"
                : "ios-megaphone-outline";
            } else if (route.name == "Map") {
              iconName = focused
                ? "ios-location-sharp"
                : "ios-location-outline";
            } else if (route.name == "Profile") {
              iconName = focused ? "ios-person-sharp" : "ios-person-outline";
            }

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={(color = focused ? "#0BE060" : "#797979")}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Post" component={Post} />
        <Tab.Screen name="Participant" component={Participant} />
        <Tab.Screen name="Map" component={Map} />
        <Tab.Screen name="Profile" component={ProfileWithProps} />
      </Tab.Navigator>
    );
  };

  //stack 네비게이션
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? ( // 로그인 상태가 아닌 경우에는 로그인 화면을 렌더링
          <>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUpWithProps} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={BottomTabScreens} />
            <Stack.Screen name="HomeContent" component={HomeContent} />
            <Stack.Screen name="ParContent" component={ParContent} />
            <Stack.Screen name="ParUpdate" component={ParUpdate} />
            <Stack.Screen name="EditProfile" component={EditProfileWithProps} />
            <Stack.Screen name="PostContent" component={PostContent} />
            <Stack.Screen name="PostUpdate" component={PostUpdateWithProps} />
            <Stack.Screen name="PostEdit" component={PostEdit} />
            <Stack.Screen
              name="CommentContainer"
              component={CommentContainerWithProps}
            />
            <Stack.Screen
              name="CommentInput"
              component={CommentInputWithProps}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
