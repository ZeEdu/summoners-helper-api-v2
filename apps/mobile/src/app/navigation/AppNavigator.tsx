import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNavigationContainerRef } from '@react-navigation/native';
import React, { useEffect } from 'react';

import Home from '../screens/home/Home';
import Login from '../screens/login/Login';
import Register from '../screens/register/Register';
import { AuthEvents } from '../../auth-events';
import { AuthTokenStorageService } from '../../services/auth-token-storage.service';
import { useAuthContext } from '../../contexts/auth/useAuth';

export type RootStackParamsList = {
  Home: undefined,
  Login: undefined,
  Register: undefined
}

export const navigationRef = createNavigationContainerRef<RootStackParamsList>();
const Stack = createNativeStackNavigator<RootStackParamsList>();

export function AppNavigator() {
  const authContext = useAuthContext();

  useEffect(() => {
    return AuthEvents.onSessionExpired(() => {
      authContext.logout()
      if (navigationRef.isReady()) {
        navigationRef.reset({ index: 0, routes: [{ name: "Login" }] })
      }
    })
  }, [])

  useEffect(() => {
    async function checkStoredTokens() {
      const tokens = await AuthTokenStorageService.get()

      if (tokens.accessToken && !authContext.user) {
        await authContext.me()
      }
    }
    checkStoredTokens()
  }, [])


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
