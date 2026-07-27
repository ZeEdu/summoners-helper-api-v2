import React, { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/home/Home';
import Login from '../screens/login/Login';
import Register from '../screens/register/Register';
import Profile from '../screens/profile/Profile';
import MyBuilds from '../screens/my-builds/MyBuilds';

import { AuthEvents } from '../../auth-events';
import { AuthTokenStorageService } from '../../services/auth-token-storage.service';
import { useAuthContext } from '../../contexts/auth/useAuth';
import { useTheme } from 'react-native-paper';
import { ThemeStorageService } from '../../services/theme-storage.service';
import { useThemeContext } from '../../providers/theme.provider';

export type RootStackParamsList = {
  Login: undefined,
  Register: undefined
}

export const navigationRef = createNavigationContainerRef<RootStackParamsList>();
const Stack = createNativeStackNavigator<RootStackParamsList>();

enum TabsSource {
  Home = 'Home',
  MyBuilds = 'MyBuilds',
  Profile = 'Profile',
}

export type TabNavigationParamsList = {
  [TabsSource.Home]: undefined,
  [TabsSource.MyBuilds]: undefined,
  [TabsSource.Profile]: undefined,
}
const Tab = createBottomTabNavigator<TabNavigationParamsList>()

export function AppNavigator() {
  const authContext = useAuthContext();
  const theme = useTheme()
  const themeContext = useThemeContext()

  useEffect(() => {
    return AuthEvents.onSessionExpired(() => {
      authContext.logout()
      if (navigationRef.isReady()) {
        navigationRef.reset({ index: 0, routes: [{ name: "Login" }] })
      }
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
    authContext.user ? (
      <Tab.Navigator>
        <Tab.Screen
          name={TabsSource.Home}
          component={Home}
          options={{
            title: 'Inicio',
            tabBarIcon: () => <Ionicons style={{ color: theme.colors.primary }} name={tabsIconMap[TabsSource.Home]} />
          }}>
        </Tab.Screen>
        <Tab.Screen
          name={TabsSource.MyBuilds}
          component={MyBuilds}
          options={{
            title: 'Minhas builds',
            tabBarIcon: () => <Ionicons style={{ color: theme.colors.primary }} name={tabsIconMap[TabsSource.MyBuilds]} />
          }}
        ></Tab.Screen>
        <Tab.Screen
          name={TabsSource.Profile}
          component={Profile}
          options={{
            title: 'Perfil',
            tabBarIcon: () => <Ionicons style={{ color: theme.colors.primary }} name={tabsIconMap[TabsSource.Profile]} />,
          }}
        ></Tab.Screen>
      </Tab.Navigator>
    ) : (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}></Stack.Screen>
        <Stack.Screen name="Register" component={Register}></Stack.Screen>
      </Stack.Navigator>
    )
  );
}
export type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const tabsIconMap: Record<TabsSource, IoniconName> = {
  [TabsSource.Home]: 'home',
  [TabsSource.MyBuilds]: 'list',
  [TabsSource.Profile]: 'person',
}