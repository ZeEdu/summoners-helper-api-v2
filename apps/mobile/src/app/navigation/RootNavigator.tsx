import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthEvents } from '../../auth-events';
import { AuthTokenStorageService } from '../../services/auth-token-storage.service';
import { useAuthContext } from '../../contexts/auth/useAuth';
import { ThemeStorageService } from '../../services/theme-storage.service';
import { useThemeContext } from '../../providers/theme.provider';
import ModalsNavigator from './ModalsNavigator';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const authContext = useAuthContext();
  const themeContext = useThemeContext()

  useEffect(() => {
    return AuthEvents.onSessionExpired(() => {
      authContext.logout()
    })
  }, [])

  useEffect(() => {
    async function checkStoredTokens() {
      const tokens = await AuthTokenStorageService.get()
      if (tokens.accessToken && !authContext.user) {
        await authContext.me()
      }
    }
    checkStoredTokens()
  }, [])

  useEffect(() => {
    async function checkThemePreference() {
      if (authContext.user) {
        const isDarkTheme = await ThemeStorageService.isDarkTheme()
        if (!themeContext.isThemeDark && isDarkTheme) {
          themeContext.toggleTheme()
        }
      }
    }

    checkThemePreference()
  }, [])

  return (
    <Stack.Navigator>{
      authContext.user ?
        (
          <Stack.Screen
            name='App'
            component={AppNavigator}
            options={{ headerShown: false }}
          >
          </Stack.Screen>
        ) :
        (
          <Stack.Screen
            name='Auth'
            component={AuthNavigator}
            options={{ headerShown: false }}
          >
          </Stack.Screen>
        )
    }
      <Stack.Screen name='Modals' component={ModalsNavigator} options={{ presentation: 'modal', headerShown: false }}>
      </Stack.Screen>
    </Stack.Navigator>
  );
}