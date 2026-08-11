import React from 'react';

import AuthProvider from '../contexts/auth/auth.provider';
import PatchVersionProvider from '../contexts/patchVersion/patch-version.provider';
import ThemeProvider from '../providers/theme.provider';
import RootNavigator from './navigation/RootNavigator';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PatchVersionProvider>
          <RootNavigator />
        </PatchVersionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
