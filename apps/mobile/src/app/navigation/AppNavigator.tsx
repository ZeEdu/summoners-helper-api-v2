import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import Home from '../screens/home/Home';
import Login from '../screens/login/Login';
import Register from '../screens/register/Register';
import { useAuthContext } from '../../contexts/auth/useAuth';
import { AuthTokenStorageService } from '../../services/auth-token-storage.service';

export type RootStackParamsList = {
  Home: undefined,
  Login: undefined,
  Register: undefined
}

const Stack = createNativeStackNavigator<RootStackParamsList>();

export function AppNavigator() {
  const authContext = useAuthContext();

  // Verificar se há um usuário local com token
  // Se tiver
  // Preencher o estado de authContext com ele

  // useEffect(() => {
  //   async function checkStoredTokens() {
  //     const tokens = await AuthTokenStorageService.get()
  //     if (tokens.accessToken) {
  //       await authContext.me()

  //       console.log({ 'authContext.user': authContext.user });

  //     }
  //   }
  //   checkStoredTokens()
  // }, [])


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
