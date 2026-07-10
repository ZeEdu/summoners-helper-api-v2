import { AuthProvider } from "apps/mobile/src/contexts/auth";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export function Login() {
  const [_, useAuthContext] = AuthProvider()
  const authContext = useAuthContext()
  const [email, setEmail] = useState<string>('')

  const handleSubmit = () => {
    authContext.login({ email })
  }

  return <View>
    <View style={style.block}>
      <Text>Email</Text>
      <TextInput style={style.textInput} onChangeText={setEmail} value={email} ></TextInput>
    </View>

    <View style={style.block}>
      <Button title="Submit" onPress={handleSubmit}></Button>
    </View>
  </View>
}

const style = StyleSheet.create({
  block: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 3,
    height: 24
  }
})