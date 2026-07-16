import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthContext } from 'apps/mobile/src/contexts/auth/useAuth';
import { RootStackParamsList } from '../../navigation/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamsList, 'Login'>

export default function Login({ navigation }: Props) {
  const authContext = useAuthContext();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async () => {
    const login = await authContext.login({ email, password });

    if (!login.success) {
      return
    }

    const me = await authContext.me()

    if (me) {
      navigation.navigate('Home')
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View>
      <View style={style.block}>
        <Text>Email</Text>
        <TextInput
          style={style.textInput}
          onChangeText={setEmail}
          value={email}
        ></TextInput>
      </View>
      <View style={style.block}>
        <Text>Password</Text>
        <TextInput
          style={style.textInput}
          onChangeText={setPassword}
          value={password}
        ></TextInput>
      </View>

      <View style={style.block}>
        <Button title="Submit" onPress={handleSubmit}></Button>
      </View>

      <View style={style.block}>
        <Button title="Go to Register" onPress={goToRegister}></Button>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  block: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 3,
    padding: 8
  },
});
