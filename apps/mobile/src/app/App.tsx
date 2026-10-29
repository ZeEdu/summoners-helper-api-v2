import React from 'react';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
                <AppNavigation />
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </AuthProvider>
        </ThemeProvider>
      </DataDragonProvider>
    </PatchVersionProvider>
  );
};

export default App;
