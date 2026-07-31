import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ModalStackParamList } from './types';
import BindRiotAccount from '../screens/modals/BindRiotAccount';

const Stack = createNativeStackNavigator<ModalStackParamList>();

export default function ModalsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BindRiotAccount" component={BindRiotAccount}>
      </Stack.Screen>
    </Stack.Navigator>
  );
}