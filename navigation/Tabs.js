import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Coins from "../screens/Coins";
import Prices from "../screens/Prices";
import News from "../screens/News";
import Discover from "../screens/Discover";
import colors from "../colors"

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.backgroundColor,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textColor,
        headerStyle: {
          backgroundColor: colors.backgroundColor,
          borderBottomWidth: 0,
          borderWidth: 0,
          shadowColor: 'transparent',
        },
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTintColor: colors.accent,
        tabBarLabelStyle: {
          marginTop: -5,
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Coins"
        component={Coins}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="coins" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Prices"
        component={Prices}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="dollar-sign" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={News}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="newspaper" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="heart" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
