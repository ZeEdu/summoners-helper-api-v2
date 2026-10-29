import { faker } from '@faker-js/faker';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';

import { CreateUserDto, createUserSchema } from '@org/contracts';
import { StyledButton } from '@org/ui';

import ApiFieldErrors from '../../../../components/forms/ApiFieldErrors';
import AppInputController from '../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../components/forms/FormFieldErrors';
import { useAuthContext } from '../../../../contexts/auth/useAuth';

const resolver = zodResolver(createUserSchema);

export default function Register() {
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
    console.log({ formData });

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
        inputOptions={{
          label: "Email",
          placeholder: "Seu Email"
        }}
        control={control}
      />
      <FormFieldErrors fieldError={errors.email} />
      <ApiFieldErrors apiErrors={apiErrors?.email} />

      <AppInputController
        control={control}
        name="username"
        inputOptions={{
          label: "Username",
          placeholder: "Seu nome de usuário"
        }}
      />
      <FormFieldErrors fieldError={errors.username} />
      <ApiFieldErrors apiErrors={apiErrors?.username} />

      <AppInputController
        name="password"
        control={control}
        inputOptions={{
          label: "Password",
          placeholder: ""
        }}
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
