import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeStackParamList } from "../../../navigation/types";
import Home from "./Home";
import Search from "./Search";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={Home}></Stack.Screen>
      <Stack.Screen name='Search' component={Search}></Stack.Screen>
    </Stack.Navigator>
  )
}