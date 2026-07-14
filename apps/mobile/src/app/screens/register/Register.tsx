import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthProvider } from '../../../contexts/auth';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { faker } from '@faker-js/faker';

export default function Register() {
  const { useAuthContext } = AuthProvider();
  const authContext = useAuthContext();

  const [email, setEmail] = useState<string>(faker.internet.email());
  const [username, setUsername] = useState<string>(faker.string.alpha(16));
  const [password, setPassword] = useState<string>(
    faker.internet.password({ prefix: '1!Ab' }),
  );

  const navigation = useNavigation();

  const handleSubmit = async () => {
    const register = await authContext.register({ email, username, password });
    if (!register.success) {
      console.log({ register });
    }
  };

  const goToRegister = () => {
    navigation.goBack();
  };

  return (
    <View>
      <View style={style.block}>
        <Text>Email: </Text>
        <TextInput
          style={style.textInput}
          onChangeText={setEmail}
          value={email}
        ></TextInput>
      </View>

      <View style={style.block}>
        <Text>Username</Text>
        <TextInput
          style={style.textInput}
          onChangeText={setUsername}
          value={username}
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
        <Button title="Go back" onPress={goToRegister}></Button>
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
