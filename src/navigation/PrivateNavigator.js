import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

import PrivateTodayScreen from "../screens/PrivateTodayScreen";
import PrivateCalendarScreen from "../screens/PrivateCalendarScreen";

const Tab = createBottomTabNavigator();

export default function PrivateNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Today") {
            iconName = focused ? "today" : "today-outline";
          } else if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primaryPrivate,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.cardBackground,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      })}
    >
      <Tab.Screen
        name="Today"
        component={PrivateTodayScreen}
        options={{ title: "Oggi" }}
      />
      <Tab.Screen
        name="Calendar"
        component={PrivateCalendarScreen}
        options={{ title: "Calendario" }}
      />
    </Tab.Navigator>
  );
}
