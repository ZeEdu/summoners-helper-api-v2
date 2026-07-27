import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton, AppTextInput } from "@org/ui";

import { RootStackParamsList } from '../../navigation/AppNavigator';
import { useAuthContext } from '../../../contexts/auth/useAuth';

type Props = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Login({ navigation }: Props) {
  const authContext = useAuthContext();

  const [email, setEmail] = useState<string>('Laron_Ernser31@hotmail.com');
  const [password, setPassword] = useState<string>('1!AbZ6LZHq0WfFn');

  const handleSubmit = async () => {
    const login = await authContext.login({ email, password });
    if (!login.success) {
      return;
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View>
        <AppTextInput
          label="Email"
          onChangeText={setEmail}
          value={email}
        ></AppTextInput>
      </View>
      <View>
        <AppTextInput
          label="Senha"
          onChangeText={setPassword}
          value={password}
        ></AppTextInput>
      </View>
      <View>
        <AppButton onPress={handleSubmit}>Submit</AppButton>
      </View>
      <View>
        <AppButton mode='contained-tonal' onPress={goToRegister}>Go to Register</AppButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flex: 1,
    paddingHorizontal: 16,
    gap: 16
  },
});
