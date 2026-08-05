import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import { LoginUserDto, loginUserSchema } from "@org/contracts";
import { StyledButton } from "@org/ui";


import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import AppInputController from '../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../components/forms/FormFieldErrors';
import { useAuthContext } from '../../../../contexts/auth/useAuth';
import { AuthStackParamList } from '../../../navigation/types';

const resolver = zodResolver(loginUserSchema)

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>

export default function Login({ navigation }: Props) {
  const authContext = useAuthContext();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginUserDto>({ resolver })

  const onSubmit = async (formData: LoginUserDto) => {
    const login = await authContext.login(formData);
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
        <AppInputController
          control={control}
          label='Email'
          placeholder='Email'
          name='email'
        />
        <FormFieldErrors fieldError={errors.email} />
      </View>
      <View>
        <AppInputController
          control={control}
          label='Senha'
          placeholder='Senha'
          name='password'
        />
        <FormFieldErrors fieldError={errors.password} />
      </View>
      <View>
        <StyledButton onPress={handleSubmit(onSubmit)}>Submit</StyledButton>
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
