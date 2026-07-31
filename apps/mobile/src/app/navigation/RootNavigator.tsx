import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthContext } from '../../contexts/auth/useAuth';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import ModalsNavigator from './ModalsNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const authContext = useAuthContext();

  return (
    <Stack.Navigator>{
      authContext.user ?
        (
          <Stack.Screen
            name='Main'
            component={MainNavigator}
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