import React from 'react';

import AuthProvider from '../contexts/auth/auth.provider';
import ThemeProvider from '../providers/theme.provider';
import RootNavigator from './navigation/RootNavigator';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
