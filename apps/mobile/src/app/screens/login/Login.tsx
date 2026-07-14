import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthProvider } from '../../../contexts/auth';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const { useAuthContext } = AuthProvider();
  const authContext = useAuthContext();
  const [email, setEmail] = useState<string>('');

  const navigation = useNavigation();

  const handleSubmit = () => {
    authContext.login({ email });
  };

  const goToRegister = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
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
    height: 24,
  },
});
