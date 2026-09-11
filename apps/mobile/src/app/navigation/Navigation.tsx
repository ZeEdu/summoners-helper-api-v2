import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useIsAuthenticated from '../../contexts/auth/useIsAuthenticated';
import useIsNotAuthenticated from '../../contexts/auth/useIsSignedOut';
import Login from '../screens/auth/login/Login';
import Register from '../screens/auth/register/Register';
import RecentGuides from '../screens/main/home/RecentGuides';
import Search from '../screens/main/home/Search';
import MyGuides from '../screens/main/my-builds/MyGuides';
import Profile from '../screens/main/profile/Profile';
import BindRiotAccount from '../screens/modals/BindRiotAccount';
import CreateGuide from '../screens/modals/CreateGuide/CreateGuide';
import ViewGuide from '../screens/modals/CreateGuide/guide-viewer/ViewGuide';

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
        title: 'Recente',
        tabBarIcon: ({ color }) => <Ionicons style={{ color }} name={'home'} />
      }
    },
    MyGuides: {
      screen: MyGuides,
      options: {
        title: 'Meus guias',
        tabBarIcon: ({ color }) => <Ionicons style={{ color: color }} name={'list'} />
      }
    },
    Profile: {
      screen: Profile,
      options: {
        title: 'Perfil',
        tabBarIcon: ({ color }) => <Ionicons style={{ color: color }} name={'person'} />
      }
    }
  },
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
        BindRiotAccount,
        CreateGuide: {
          screen: CreateGuide
        },
        ViewGuide: {
          screen: ViewGuide
        }
      },
      screenOptions: {
        presentation: 'modal'
      }
    },
    NotAuthenticated: {
      if: useIsNotAuthenticated,
      screens: {
        Login,
        Register
      }
    }
  },
});


export const Navigation = createStaticNavigation(RootStack)

type RootStackType = typeof RootStack;

declare module '@react-navigation/native' {
  interface RootNavigator extends RootStackType { }
}
