import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Button } from 'react-native-paper';
import BindRiotAccount from '../screens/modals/BindRiotAccount';
import CreateGuide, { style } from '../screens/modals/CreateGuide/CreateGuide';
import { ModalStackParamList } from './types';

const Stack = createNativeStackNavigator<ModalStackParamList>();

export default function ModalsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen name="BindRiotAccount" component={BindRiotAccount} />
      <Stack.Screen name="CreateGuide" component={CreateGuide} options={{
        headerRight: () => <Button mode='contained' style={style.headerButton}>Salvar</Button>,
      }} />
    </Stack.Navigator>
  );
}