import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { StyledButton, StyledTextInput } from "@org/ui";

import { useAuthContext } from '../../../../contexts/auth/useAuth';
import { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>

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
        <StyledTextInput
          label="Email"
          onChangeText={setEmail}
          value={email}
        ></StyledTextInput>
      </View>
      <View>
        <StyledTextInput
          label="Senha"
          onChangeText={setPassword}
          value={password}
        ></StyledTextInput>
      </View>
      <View>
        <StyledButton onPress={handleSubmit}>Submit</StyledButton>
      </View>
      <View>
        <StyledButton mode='contained-tonal' onPress={goToRegister}>Go to Register</StyledButton>
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
