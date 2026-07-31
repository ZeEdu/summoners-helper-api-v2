import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/auth/login/Login';
import Register from '../screens/auth/register/Register';

import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Register" component={Register}></Stack.Screen>
      <Stack.Screen name="Login" component={Login}></Stack.Screen >
    </Stack.Navigator>
  );
}