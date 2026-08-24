import React from 'react';

import AuthProvider from '../contexts/auth/auth.provider';
import DataDragonProvider from '../contexts/data-dragon/data-dragon.provider';
import PatchVersionProvider from '../contexts/patchVersion/patch-version.provider';
import ThemeProvider from '../providers/theme.provider';
import RootNavigator from './navigation/RootNavigator';

export const App = () => {
  return (
    <PatchVersionProvider>
      <DataDragonProvider>
        <ThemeProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </ThemeProvider>
      </DataDragonProvider>
    </PatchVersionProvider>
  );
};

export default App;
