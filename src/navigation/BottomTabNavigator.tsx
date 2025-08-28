import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image } from 'react-native';
import icons from '../assets/icons';
import { Screen_Name } from './ScreenName';
import HomeScreen from '../screens/HomeStack/HomeScreen';
import { useSelector } from 'react-redux';
import CreateCV from '../screens/HomeStack/CV/CreateCV';
import CreateCVScreen from '../screens/HomeStack/CV/CreateCV';
import CommentScreen from '../screens/HomeStack/Comment';
import NotificationScreen from '../screens/HomeStack/Notification';
import UserScreen from '../screens/HomeStack/User';
import CVScreen from '../screens/HomeStack/CV';

// Các màn hình cho các tab

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { token } = useSelector((state: any) => state.user); // ✅ lấy token từ Redux

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#ddd',
          paddingTop: 10,
        },
        tabBarIcon: ({ focused }) => {
          const iconMap = {
            Home_Screen: focused ? icons.home_focus : icons.home,
            CV_Screen: focused ? icons.document_focus : icons.document,
            Comment_Screen: focused ? icons.chat_focus : icons.chat,
            Noti_Screen: focused ? icons.noti_focus : icons.noti,
            User_Screen: focused ? icons.username_focus : icons.username,
          };

          return (
            <Image
              source={iconMap[route.name]}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#820201',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name={Screen_Name.Home_Screen} component={HomeScreen} />
      <Tab.Screen name={Screen_Name.CV_Screen} component={CVScreen} />
      <Tab.Screen name={Screen_Name.Comment_Screen} component={CommentScreen} />
      <Tab.Screen
        name={Screen_Name.Noti_Screen}
        component={NotificationScreen}
      />
      <Tab.Screen name={Screen_Name.User_Screen} component={UserScreen} />
      {/* ✅ Thêm 2 tab mới nếu có token */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
