import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useAuthContext } from '../../../contexts/auth/useAuth';

export default function Home() {
  const authContext = useAuthContext();

  const handleLogout = () => {
    authContext.logout();
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
      <View>
        <Text>Email: {authContext?.user?.email}</Text>
        <Text>Username: {authContext?.user?.username}</Text>
      </View>
      <View style={styles.buttonsWrapper}>
        <Button title="Deslogar" onPress={handleLogout}></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  buttons: {},
});
