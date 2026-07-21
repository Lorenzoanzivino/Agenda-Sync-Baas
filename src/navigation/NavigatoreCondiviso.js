import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../constants/theme";

import SchermataOggiCondivisa from "../screens/SchermataOggiCondivisa";
import SchermataCalendarioCondiviso from "../screens/SchermataCalendarioCondiviso";
import SchermataGestioneCondivisa from "../screens/SchermataGestioneCondivisa";

const Tab = createBottomTabNavigator();

export default function NavigatoreCondiviso() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Oggi")
            iconName = focused ? "today" : "today-outline";
          else if (route.name === "Calendario")
            iconName = focused ? "calendar" : "calendar-outline";
          else if (route.name === "Gestione")
            iconName = focused ? "settings" : "settings-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primaryShared,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.cardBackground,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
      })}
    >
      <Tab.Screen name="Oggi" component={SchermataOggiCondivisa} />
      <Tab.Screen name="Calendario" component={SchermataCalendarioCondiviso} />
      <Tab.Screen name="Gestione" component={SchermataGestioneCondivisa} />
    </Tab.Navigator>
  );
}
