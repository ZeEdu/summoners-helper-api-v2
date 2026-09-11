import React from 'react';

import AuthProvider from '../contexts/auth/auth.provider';
import DataDragonProvider from '../contexts/data-dragon/data-dragon.provider';
import PatchVersionProvider from '../contexts/patchVersion/patch-version.provider';
import ThemeProvider, { useThemeContext } from '../providers/theme.provider';
import { Navigation } from './navigation/Navigation';

function AppNavigation() {
  const { navigationTheme } = useThemeContext()
  return <Navigation theme={navigationTheme} />
}

export const App = () => {
  return (
    <PatchVersionProvider>
      <DataDragonProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppNavigation />
          </AuthProvider>
        </ThemeProvider>
      </DataDragonProvider>
    </PatchVersionProvider>
  );
};

export default App;
