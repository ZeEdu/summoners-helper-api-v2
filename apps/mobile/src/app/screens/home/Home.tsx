import { Button, Text, View } from 'react-native';
import React from 'react';
import { useAuthContext } from 'apps/mobile/src/contexts/auth/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamsList, 'Home'>

export default function Home({ navigation }: Props) {
  const authContext = useAuthContext();

  const handleLogout = () => {
    authContext.logout();
    navigation.navigate("Login")
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
      <Button title="Log out" onPress={handleLogout}></Button>
    </View>
  );
}
