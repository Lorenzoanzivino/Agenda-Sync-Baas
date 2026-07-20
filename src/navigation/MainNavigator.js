import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PrivateNavigator from "./PrivateNavigator";
import SharedHomeScreen from "../screens/SharedHomeScreen";

const Tab = createMaterialTopTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen name="PrivateArea" component={PrivateNavigator} />
      <Tab.Screen name="SharedArea" component={SharedHomeScreen} />
    </Tab.Navigator>
  );
}
