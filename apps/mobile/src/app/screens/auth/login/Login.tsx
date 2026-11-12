import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { LoginUserDto, loginUserSchema } from "@org/contracts";
import { StyledButton } from "@org/ui";

import React from 'react';
import AppInputController from '../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../components/forms/FormFieldErrors';
import { useAuthContext } from '../../../../contexts/auth/useAuth';
import useI18n from '../../../../contexts/i18n/useI18n';
import useZodResolver from '../../../../hooks/useZodResolver';
import ChangeLanguageButton from '../../main/profile/change-language-button/ChangeLanguageButton';

export default function Login() {
  const i18n = useI18n()
  const authContext = useAuthContext();
  const navigation = useNavigation()

  const resolver = useZodResolver(loginUserSchema)
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


  navigation.setOptions({
    headerRight: () => (
      <View style={{ padding: 16 }}>
        <ChangeLanguageButton showCurrentLanguageAsButtonText={true} />
      </View>)
  })

  return (
    <View style={styles.container}>
      <View>
        <AppInputController
          control={control}
          inputOptions={{
            label: i18n.t('login.fields.email.label'),
            placeholder: i18n.t('login.fields.email.placeholder')
          }}
          name='email'
        />
        <FormFieldErrors fieldError={errors.email} />
      </View>
      <View>
        <AppInputController
          control={control}
          inputOptions={{
            label: i18n.t('login.fields.password.label'),
            placeholder: i18n.t('login.fields.password.placeholder'),
            secureTextEntry: true,
            autoCapitalize: 'none'
          }}
          name='password'
        />
        <FormFieldErrors fieldError={errors.password} />
      </View>
      <View style={styles.actionButtons}>
        <StyledButton onPress={handleSubmit(onSubmit)}>{i18n.t('login.submit')}</StyledButton>
        <StyledButton mode='contained-tonal' onPress={goToRegister}>{i18n.t('login.goToRegister')}</StyledButton>
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
  actionButtons: {
    gap: 16
  }
});
