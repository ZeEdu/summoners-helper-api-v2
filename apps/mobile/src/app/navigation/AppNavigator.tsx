import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Home from '../screens/home/Home';
import Login from '../screens/login/Login';
import Register from '../screens/register/Register';
import { useAuthContext } from '../../contexts/auth/useAuth';

export type RootStackParamsList = {
  Home: undefined,
  Login: undefined,
  Register: undefined
}

const Stack = createNativeStackNavigator<RootStackParamsList>();

export function AppNavigator() {
  const authContext = useAuthContext();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'purple' },
      }}
    >
      {authContext.user ? (
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
          <Stack.Screen name="Register" component={Register}></Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}
