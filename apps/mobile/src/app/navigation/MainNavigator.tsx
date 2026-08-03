import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import { MainTabsParamList } from './types';

const Stack = createNativeStackNavigator<MainTabsParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={MainTabs}></Stack.Screen>
    </Stack.Navigator>
  );
}