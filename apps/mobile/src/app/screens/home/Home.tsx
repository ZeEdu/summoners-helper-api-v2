import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useAuthContext } from 'apps/mobile/src/contexts/auth/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '../../navigation/AppNavigator';
import { ApiService } from 'apps/mobile/src/services/api/api.service';

type Props = NativeStackScreenProps<RootStackParamsList, 'Home'>

export default function Home({ navigation }: Props) {
  const authContext = useAuthContext();
  const [canCall, setCanCall] = useState(false)

  const handleLogout = () => {
    authContext.logout();
    // navigation.navigate("Login")
  };

  if (!authContext.user) {
    navigation.navigate('Home')
    return
  }

  const handleGetUsers = async () => {
    const response = await ApiService.Users.users()
    console.log({ response });
  }

  setTimeout(() => {
    console.log('Deu o tempo');
    setCanCall(true)
  }, 5_000);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
      <View>
        <Text>Email: {authContext.user.email}</Text>
        <Text>Username: {authContext.user.username}</Text>
      </View>
      <View style={styles.buttonsWrapper}>
        <Button title="Deslogar" onPress={handleLogout}></Button>
        {canCall && <Button title="Buscar dados" onPress={handleGetUsers}></Button>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5
  },
  buttons: {
    // flex: 1
  }
})
