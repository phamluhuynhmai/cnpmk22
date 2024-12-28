import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useToast } from 'react-native-toast-notifications';
import { useRoute } from '@react-navigation/native';

import { 
  RestaurentsScreen, 
  HistoryScreen, 
  ProfileScreen, 
  ChangeEmailScreen, 
  ChangePasswordScreen, 
  AboutScreen 
} from './../views';

const Tab = createBottomTabNavigator();

const TabNavigation = ({ navigation }) => {
  const toast = useToast();
  const route = useRoute();

  useEffect(() => {
    CheckToken();
  }, []);

  const CheckToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@token');
      if (value == null || value == undefined) {
        toast.show('Not authorized, please log in!', {
          type: 'danger',
          placement: 'bottom',
          duration: 4000,
          offset: 30,
          animationType: 'zoom-in',
        });
        navigation.popTo('LoginScreen');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Restaurents"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#659349',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Restaurents') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'sync' : 'sync-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'ChangeEmail') {
            iconName = focused ? 'mail' : 'mail-outline';
          } else if (route.name === 'ChangePassword') {
            iconName = focused ? 'lock-closed' : 'lock-closed-outline';
          } else if (route.name === 'About') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Restaurents" 
        component={RestaurentsScreen} 
        initialParams={{ user: route.params.user }} 
        options={{ title: 'Quán ăn' }} 
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        initialParams={{ user: route.params.user }} 
        options={{ title: 'Lịch sử' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        initialParams={{ user: route.params.user }} 
        options={{ title: 'Thông tin người dùng' }} 
      />
      <Tab.Screen 
        name="ChangeEmail" 
        component={ChangeEmailScreen} 
        initialParams={{ user: route.params.user }} 
        options={{ title: 'Đổi email' }} 
      />
      <Tab.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen} 
        initialParams={{ user: route.params.user }} 
        options={{ title: 'Đổi mật khẩu' }} 
      />
      <Tab.Screen 
        name="About" 
        component={AboutScreen} 
        initialParams={{ user: route.params.user }} 
        options={{ title: 'Về chúng tôi' }} 
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
