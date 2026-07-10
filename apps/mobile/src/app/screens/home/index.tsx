import { Button, Text, View } from "react-native";
import React from "react";
import { AuthProvider } from "apps/mobile/src/contexts/auth";

export default function Home() {
  const [_, useAuthContext] = AuthProvider()
  const authContext = useAuthContext()

  const handleRemoveUser = () => {
    authContext.logout()
  }

  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Home</Text>
    <Button title="Remove user" onPress={handleRemoveUser}></Button>
  </View>
}