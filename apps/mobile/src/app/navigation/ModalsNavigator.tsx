import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BindRiotAccount from '../screens/modals/BindRiotAccount';
import CreateGuide from '../screens/modals/CreateGuide/CreateGuide';
import { ModalStackParamList } from './types';

const Stack = createNativeStackNavigator<ModalStackParamList>();

export default function ModalsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen name="BindRiotAccount" component={BindRiotAccount} />
      <Stack.Screen name="CreateGuide" component={CreateGuide} />
    </Stack.Navigator>
  );
}