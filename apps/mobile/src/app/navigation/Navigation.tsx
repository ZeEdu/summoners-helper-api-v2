import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React from 'react';
import useIsAuthenticated from '../../contexts/auth/useIsAuthenticated';
import useIsNotAuthenticated from '../../contexts/auth/useIsSignedOut';
import useI18n from '../../contexts/i18n/useI18n';
import Login from '../screens/auth/login/Login';
import Register from '../screens/auth/register/Register';
import Search from '../screens/main/home/advanced-search/AdvancedSearch';
import RecentGuides from '../screens/main/home/recent-guides/RecentGuides';
import MyGuides from '../screens/main/my-builds/MyGuides';
import Profile from '../screens/main/profile/Profile';
import BindRiotAccount from '../screens/modals/BindRiotAccount';
import CreateGuide from '../screens/modals/CreateGuide/CreateGuide';
import ViewGuide from '../screens/modals/CreateGuide/guide-viewer/ViewGuide';
import Report from '../screens/modals/Report';

const HomeStack = createNativeStackNavigator({
  screens: {
    RecentGuides: { screen: RecentGuides },
    Search: { screen: Search }
  },
  screenOptions: {
    headerShown: false,
  }
})

const MainTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeStack,
      options: {
        tabBarIcon: ({ color }) => <Ionicons style={{ color }} name={'home'} />
      }
    },
    MyGuides: {
      screen: MyGuides,
      options: {
        tabBarIcon: ({ color }) => <Ionicons style={{ color: color }} name={'list'} />
      }
    },
    Profile: {
      screen: Profile,
      options: {
        tabBarIcon: ({ color }) => <Ionicons style={{ color: color }} name={'person'} />
      }
    }
  }
})
  .with(({ Navigator }) => {
    const i18n = useI18n()
    return (
      <Navigator screenOptions={({ route }) => {
        const title = i18n.t(`screens.${route.name}`)
        return { title }
      }} />
    )
  });

const RootStack = createNativeStackNavigator({
  groups: {
    Authenticated: {
      if: useIsAuthenticated,
      screens: {
        MainTabs: MainTabs,
      },
      screenOptions: {
        headerShown: false
      }
    },
    AuthenticatedModals: {
      if: useIsAuthenticated,
      screens: {
        BindRiotAccount: {
          screen: BindRiotAccount
        },
        CreateGuide: {
          screen: CreateGuide
        },
        ViewGuide: {
          screen: ViewGuide
        },
        Report: {
          screen: Report
        }
      },
      screenOptions: {
        presentation: 'modal'
      }
    },
    NotAuthenticated: {
      if: useIsNotAuthenticated,
      screens: {
        Login: {
          screen: Login
        },
        Register: {
          screen: Register
        }
      }
    }
  },
}).with(({ Navigator }) => {
  const i18n = useI18n()

  return <Navigator
    screenOptions={({ route }) => ({
      title: route.name === 'MainTabs' ? '' : i18n.t(`screens.${route.name}`)
    })} />
});

export const Navigation = createStaticNavigation(RootStack)

type RootStackType = typeof RootStack;

declare module '@react-navigation/native' {
  interface RootNavigator extends RootStackType { }
}
