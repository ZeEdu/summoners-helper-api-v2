import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { useAuthContext } from '../../contexts/auth/useAuth';
import useDataDragonContext from '../../contexts/data-dragon/useDataDragonContext';
import Error from '../screens/feedback/Error';
import Loading from '../screens/feedback/Loading';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import ModalsNavigator from './ModalsNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const authContext = useAuthContext();
  const useDataDragon = useDataDragonContext()

  if (useDataDragon.error) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Error' component={Error}></Stack.Screen>
      </Stack.Navigator>
    )
  }

  if (useDataDragon.loading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Loading' component={Loading}></Stack.Screen>
      </Stack.Navigator>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>{
      authContext.user ?
        (
          <Stack.Screen
            name='Main'
            component={MainNavigator}
          >
          </Stack.Screen>
        ) :
        (
          <Stack.Screen
            name='Auth'
            component={AuthNavigator}
          >
          </Stack.Screen>
        )
    }
      <Stack.Screen name='Modals' component={ModalsNavigator}></Stack.Screen>
    </Stack.Navigator>
  );
}