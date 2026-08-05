import { faker } from '@faker-js/faker';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';

import { CreateUserDto, createUserSchema } from '@org/contracts';
import { StyledButton } from '@org/ui';

import ApiFieldErrors from '../../../../components/forms/ApiFieldErrors';
import AppInputController from '../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../components/forms/FormFieldErrors';
import { useAuthContext } from '../../../../contexts/auth/useAuth';
import { AuthStackParamList } from '../../../navigation/types';

const resolver = zodResolver(createUserSchema);

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>

export default function Register(props: Props) {
  const authContext = useAuthContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDto>({
    resolver,
    defaultValues: {
      email: faker.internet.email(),
      username: faker.string.alpha(16),
      password: faker.internet.password({ prefix: '1!Ab' }),
    },
  });

  type ApiErrorsType = Partial<{ [K in keyof CreateUserDto]: string[] }>;
  const [apiErrors, setApiErrors] = useState<ApiErrorsType | undefined>(
    undefined,
  );

  const onSubmit = async (formData: CreateUserDto) => {
    const register = await authContext.register({
      email: formData.email,
      username: formData.username,
      password: formData.password,
    });

    if (!register.success) {
      if (register.errors) {
        if (typeof register.errors === 'string') {
          Alert.alert('Um erro ocorreu', register.errors);
        } else {
          setApiErrors(register.errors);
        }
      }
    }
  };

  return (
    <View style={style.block}>
      <AppInputController
        name="email"
        label="Email:"
        control={control}
        placeholder="Seu Email"
      />
      <FormFieldErrors fieldError={errors.email} />
      <ApiFieldErrors apiErrors={apiErrors?.email} />

      <AppInputController
        name="username"
        label="Username:"
        control={control}
        placeholder="Seu nome de usuário"
      />
      <FormFieldErrors fieldError={errors.username} />
      <ApiFieldErrors apiErrors={apiErrors?.username} />

      <AppInputController
        name="password"
        label="Password:"
        control={control}
        placeholder="Sua senha"
      />
      <FormFieldErrors fieldError={errors.password} />
      <ApiFieldErrors apiErrors={apiErrors?.password} />

      <View>
        <StyledButton onPress={handleSubmit(onSubmit)}>Submit</StyledButton>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  block: {
    marginTop: 16,
    flex: 1,
    paddingHorizontal: 16,
    gap: 16
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 3,
    padding: 12,
  },
});
