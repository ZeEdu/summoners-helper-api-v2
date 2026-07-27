import React from 'react';

import { AppNavigator } from './navigation/AppNavigator';
import AuthProvider from '../contexts/auth/auth.provider';
import ThemeProvider from '../providers/theme.provider';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
