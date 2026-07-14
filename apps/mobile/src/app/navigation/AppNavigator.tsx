import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Home from '../screens/home/Home';
import Login from '../screens/login/Login';
import Register from '../screens/register/Register';
import { AuthProvider } from '../../contexts/auth';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { useAuthContext } = AuthProvider();
  const authContext = useAuthContext();

  if (authContext?.user) {
    return (
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: 'purple' },
        }}
      >
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: 'purple' },
      }}
    >
      <Stack.Screen name="Login" component={Login}></Stack.Screen>
      <Stack.Screen name="Register" component={Register}></Stack.Screen>
    </Stack.Navigator>
  );
}
