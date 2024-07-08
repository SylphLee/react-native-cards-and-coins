import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Detail from "../screens/Detail";
import Tabs from "./Tabs";

const Stack = createNativeStackNavigator();

export default function StackNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "modal",
        headerStyle: { backgroundColor: "#1e272e" },
        headerTintColor: "#fd79a8",
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="Tabs"
        component={Tabs}
      />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  );
}