import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";

// I file ora si trovano nella sottocartella "privato/"
import PrivateTodayScreen from "../screens/privato/PrivateTodayScreen";
import PrivateCalendarScreen from "../screens/privato/PrivateCalendarScreen";

const Tab = createBottomTabNavigator();

export default function PrivateNavigator() {
  const insets = useSafeAreaInsets();

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
        tabBarActiveTintColor: PaletteColori.privato.primary,
        tabBarInactiveTintColor: PaletteColori.privato.textSecondary,
        tabBarStyle: {
          backgroundColor: PaletteColori.privato.cardBackground,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen
        name="Today"
        component={PrivateTodayScreen}
        options={{ title: Testi.privato.oggiTitle }}
      />
      <Tab.Screen
        name="Calendar"
        component={PrivateCalendarScreen}
        options={{ title: Testi.privato.calendarioTitle }}
      />
    </Tab.Navigator>
  );
}
