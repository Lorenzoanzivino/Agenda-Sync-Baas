import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";

// I file ora si trovano nella sottocartella "condiviso/"
import SchermataOggiCondivisa from "../screens/condiviso/SchermataOggiCondivisa";
import SchermataCalendarioCondiviso from "../screens/condiviso/SchermataCalendarioCondiviso";
import SchermataGestioneCondivisa from "../screens/condiviso/SchermataGestioneCondivisa";

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
        tabBarActiveTintColor: PaletteColori.condiviso.primary,
        tabBarInactiveTintColor: PaletteColori.condiviso.textSecondary,
        tabBarStyle: {
          backgroundColor: PaletteColori.condiviso.cardBackground,
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
      <Tab.Screen
        name="Oggi"
        component={SchermataOggiCondivisa}
        options={{ title: Testi.condiviso.oggiTitle }}
      />
      <Tab.Screen
        name="Calendario"
        component={SchermataCalendarioCondiviso}
        options={{ title: Testi.condiviso.calendarioTitle }}
      />
      <Tab.Screen
        name="Gestione"
        component={SchermataGestioneCondivisa}
        options={{ title: Testi.condiviso.gestioneTitle }}
      />
    </Tab.Navigator>
  );
}
