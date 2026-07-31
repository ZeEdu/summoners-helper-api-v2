import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import { MainTabsParamList } from './types';

const Stack = createNativeStackNavigator<MainTabsParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={MainTabs} options={{ headerShown: false }}></Stack.Screen>
    </Stack.Navigator>
  );
}