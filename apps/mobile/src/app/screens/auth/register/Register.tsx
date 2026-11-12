import { faker } from '@faker-js/faker';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';

import { CreateUserDto, createUserSchema } from '@org/contracts';
import { StyledButton } from '@org/ui';

import { useNavigation } from '@react-navigation/native';
import ApiFieldErrors from '../../../../components/forms/ApiFieldErrors';
import AppInputController from '../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../components/forms/FormFieldErrors';
import { useAuthContext } from '../../../../contexts/auth/useAuth';
import useI18n from '../../../../contexts/i18n/useI18n';
import useZodResolver from '../../../../hooks/useZodResolver';
import ChangeLanguageButton from '../../main/profile/change-language-button/ChangeLanguageButton';

export default function Register() {
  const i18n = useI18n()
  const authContext = useAuthContext()
  const navigation = useNavigation()

  const resolver = useZodResolver(createUserSchema)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDto>({
    resolver,
    defaultValues: {
      email: faker.internet.email(),
      username: faker.string.alpha(16),
      password: '1Ab' + 'x'.repeat(5),
    },
  });

  type ApiErrorsType = Partial<{ [K in keyof CreateUserDto]: string[] }>;
  const [apiErrors, setApiErrors] = useState<ApiErrorsType | undefined>(
    undefined,
  );

  navigation.setOptions({
    headerRight: () => (
      <View style={{ padding: 16 }}>
        <ChangeLanguageButton showCurrentLanguageAsButtonText={true} />
      </View>)
  })

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
          label: i18n.t('register.fields.email.label'),
          placeholder: i18n.t('register.fields.email.placeholder')
        }}
        control={control}
      />
      <FormFieldErrors fieldError={errors.email} />
      <ApiFieldErrors apiErrors={apiErrors?.email} />

      <AppInputController
        control={control}
        name="username"
        inputOptions={{
          label: i18n.t('register.fields.username.label'),
          placeholder: i18n.t('register.fields.username.placeholder')
        }}
      />
      <FormFieldErrors fieldError={errors.username} />
      <ApiFieldErrors apiErrors={apiErrors?.username} />

      <AppInputController
        name="password"
        control={control}
        inputOptions={{
          label: i18n.t('register.fields.password.label'),
          placeholder: i18n.t('register.fields.password.placeholder')
        }}
      />
      <FormFieldErrors fieldError={errors.password} />
      <ApiFieldErrors apiErrors={apiErrors?.password} />

      <View>
        <StyledButton onPress={handleSubmit(onSubmit)}>{i18n.t('register.submit')}</StyledButton>
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
