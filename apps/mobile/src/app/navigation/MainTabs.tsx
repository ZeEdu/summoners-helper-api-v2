import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/app/home/Home';
import Profile from '../screens/app/profile/Profile';
import MyBuilds from '../screens/app/my-builds/MyBuilds';

import { useTheme } from 'react-native-paper';
import { AppStackParamList, Routes } from './types';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type TabsTypes = {
  name: keyof AppStackParamList,
  component: (props: any) => React.JSX.Element,
  title: string,
  icon: IoniconName
}

const TABS: TabsTypes[] = [
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

const Tab = createBottomTabNavigator<AppStackParamList>()

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