import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { AppNavigator } from './navigation/AppNavigator';
import { AuthProvider } from '../contexts/auth';

export const App = () => {
  const { Provider } = AuthProvider();

  return (
    <NavigationContainer>
      <Provider>
        <AppNavigator />
      </Provider>
    </NavigationContainer>
  );
};

export default App;
