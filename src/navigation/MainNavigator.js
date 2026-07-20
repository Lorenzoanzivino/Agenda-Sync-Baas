import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PrivateHomeScreen from "../screens/PrivateHomeScreen";
import SharedHomeScreen from "../screens/SharedHomeScreen";

const Tab = createMaterialTopTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen name="PrivateHome" component={PrivateHomeScreen} />
      <Tab.Screen name="SharedHome" component={SharedHomeScreen} />
    </Tab.Navigator>
  );
}
