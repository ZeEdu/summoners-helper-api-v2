import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "../screens/home";
import { Login } from "../screens/login";
import { Register } from "../screens/register";
import { AuthProvider } from "../../contexts/auth";

const Stack = createNativeStackNavigator()

export function AppNavigator() {
  const [_, useAuthContext] = AuthProvider()
  const authContext = useAuthContext()

  if (authContext?.user) {
    return <Stack.Navigator initialRouteName="Home" screenOptions={{
      headerStyle: { backgroundColor: 'tomato' }
    }}>
      <Stack.Screen name="Home" component={Home}>
      </Stack.Screen>
    </Stack.Navigator>
  }

  return <Stack.Navigator initialRouteName="Login" screenOptions={{
    headerStyle: { backgroundColor: 'tomato' }
  }}>
    <Stack.Screen name="Login" component={Login}>
    </Stack.Screen>
    <Stack.Screen name="Register" component={Register}>
    </Stack.Screen>
  </Stack.Navigator>
}