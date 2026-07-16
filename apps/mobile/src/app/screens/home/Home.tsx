import { Button, Text, View } from 'react-native';
import React from 'react';
import { useAuthContext } from 'apps/mobile/src/contexts/auth/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '../../navigation/AppNavigator';
import { ApiService } from 'apps/mobile/src/services/api/api.service';

type Props = NativeStackScreenProps<RootStackParamsList, 'Home'>

export default function Home({ navigation }: Props) {
  const authContext = useAuthContext();

  const handleLogout = () => {
    authContext.logout();
    navigation.navigate("Login")
  };

  if (!authContext.user) {
    navigation.navigate('Home')
    return
  }

  const handleGetUsers = async () => {
    const response = await ApiService.Users.users()
    const json = response.json()
    console.log({ json });
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
      <View>
        <Text>Email: {authContext.user.email}</Text>
        <Text>Username: {authContext.user.username}</Text>

      </View>
      <Button title="Log out" onPress={handleLogout}></Button>
      <Button title="Buscar dados" onPress={handleGetUsers}></Button>
    </View>
  );
}
