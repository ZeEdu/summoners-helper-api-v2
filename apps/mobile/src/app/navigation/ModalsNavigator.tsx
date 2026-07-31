import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BindRiotAccount from '../screens/modals/BindRiotAccount';
import { ModalStackParamList } from './types';

const Stack = createNativeStackNavigator<ModalStackParamList>();

export default function ModalsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BindRiotAccount" component={BindRiotAccount}>
      </Stack.Screen>
    </Stack.Navigator>
  );
}