import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '../../navigation/AppNavigator';
import { useAuthContext } from '../../../contexts/auth/useAuth';

type Props = NativeStackScreenProps<RootStackParamsList, 'Register'>;

export default function Register({ navigation }: Props) {
  const authContext = useAuthContext();

  const [email, setEmail] = useState<string>(faker.internet.email());
  const [username, setUsername] = useState<string>(faker.string.alpha(16));
  const [password, setPassword] = useState<string>(
    faker.internet.password({ prefix: '1!Ab' }),
  );

  const handleSubmit = async () => {
    const register = await authContext.register({ email, username, password });
    if (!register.success) {
      // TODO tratar os erros
      return;
    }

    navigation.navigate('Home');
  };

  const goToRegister = () => {
    navigation.goBack();
  };

  return (
    <View>
      <View style={style.block}>
        <Text>Email:</Text>
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
    padding: 12,
  },
});
