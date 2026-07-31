import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/main/home/Home';
import Profile from '../screens/main/profile/Profile';
import MyBuilds from '../screens/main/my-builds/MyBuilds';

import { useTheme } from 'react-native-paper';
import { MainTabsParamList, Routes } from './types';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type TabsType = {
  name: keyof MainTabsParamList,
  component: React.ComponentType<any>,
  title: string,
  icon: IoniconName
}

const TABS: TabsType[] = [
  {
    name: Routes.Home,
    component: Home,
    title: 'Início',
    icon: 'home'
  },
  {
    name: Routes.MyBuilds,
    component: MyBuilds,
    title: 'Minhas builds',
    icon: 'list'
  },
  {
    name: Routes.Profile,
    component: Profile,
    title: 'Perfil',
    icon: 'person'
  }
]

const Tab = createBottomTabNavigator<MainTabsParamList>()

export default function MainTabs() {
  const theme = useTheme()

  return (
    <Tab.Navigator initialRouteName={Routes.Home}>
      {
        TABS.map(({ name, component, title, icon }) => {
          return <Tab.Screen
            name={name}
            component={component}
            options={{
              title,
              tabBarIcon: () => <Ionicons style={{ color: theme.colors.primary }} name={icon} />
            }}
          ></Tab.Screen>
        })
      }
    </Tab.Navigator>
  )
}