import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { AppNavigator } from './navigation/AppNavigator';
import { AuthProvider } from '../contexts/auth/auth.provider';

export const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
