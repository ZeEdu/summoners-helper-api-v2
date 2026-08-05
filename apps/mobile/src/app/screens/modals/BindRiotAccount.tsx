import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { RIOT_SERVERS, RIOT_SERVERS_LABEL, UpdateUserProfileDto, updateUserProfileSchema } from '@org/contracts';
import { StyledButton, StyledView } from '@org/ui';

import AppController from '../../../components/forms/AppController';
import FormFieldErrors from '../../../components/forms/FormFieldErrors';
import { useAuthContext } from '../../../contexts/auth/useAuth';
import { ApiService } from '../../../services/api/api.service';
import { ModalStackParamList } from '../../navigation/types';
import AppSelectController from './AppSelect';

const serverOptions: { value: RIOT_SERVERS; label: RIOT_SERVERS_LABEL }[] = [
  {
    value: RIOT_SERVERS.br1,
    label: RIOT_SERVERS_LABEL.br1,
  },
  {
    value: RIOT_SERVERS.eun1,
    label: RIOT_SERVERS_LABEL.eun1,
  },
  {
    value: RIOT_SERVERS.euw1,
    label: RIOT_SERVERS_LABEL.euw1,
  },
  {
    value: RIOT_SERVERS.jp1,
    label: RIOT_SERVERS_LABEL.jp1,
  },
  {
    value: RIOT_SERVERS.kr,
    label: RIOT_SERVERS_LABEL.kr,
  },
  {
    value: RIOT_SERVERS.la1,
    label: RIOT_SERVERS_LABEL.la1,
  },
  {
    value: RIOT_SERVERS.la2,
    label: RIOT_SERVERS_LABEL.la2,
  },
  {
    value: RIOT_SERVERS.me1,
    label: RIOT_SERVERS_LABEL.me1,
  },
  {
    value: RIOT_SERVERS.na1,
    label: RIOT_SERVERS_LABEL.na1,
  },
  {
    value: RIOT_SERVERS.oc1,
    label: RIOT_SERVERS_LABEL.oc1,
  },
  {
    value: RIOT_SERVERS.ru,
    label: RIOT_SERVERS_LABEL.ru,
  },
  {
    value: RIOT_SERVERS.sg2,
    label: RIOT_SERVERS_LABEL.sg2,
  },
  {
    value: RIOT_SERVERS.tr1,
    label: RIOT_SERVERS_LABEL.tr1,
  },
  {
    value: RIOT_SERVERS.tw2,
    label: RIOT_SERVERS_LABEL.tw2,
  },
  {
    value: RIOT_SERVERS.vn2,
    label: RIOT_SERVERS_LABEL.vn2,
  },
] as const;

const resolver = zodResolver(updateUserProfileSchema);

type Props = NativeStackScreenProps<ModalStackParamList, 'BindRiotAccount'>

export default function BindRiotAccount({ navigation }: Props) {
  const authContext = useAuthContext()

  const defaultServerValue = RIOT_SERVERS.na1
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateUserProfileDto>({
    resolver,
    defaultValues: {
      server: defaultServerValue,
      gameName: 'MunchyPunchyLOL',
      tagLine: 'TTV1'
    },
  });

  const [visibleSnackbar, setVisibleSnackbar] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const snackbarFeedback = {
    success: 'Dados atualizados com sucesso',
    error: 'Um erro ocorreu. Tente novamente'
  }

  const hideSnackbar = () => {
    setVisibleSnackbar(false)

    if (updateSuccess) {
      navigation.goBack()
    }
  }

  const onSubmit = async (value: UpdateUserProfileDto) => {
    setUpdateSuccess(false)

    try {
      await ApiService.Users.updateProfile(value)
      await authContext.me()

      setUpdateSuccess(true)
    } catch (_) {
      setUpdateSuccess(false)
    } finally {
      setVisibleSnackbar(true)
    }
  }

  return (
    <>
      <StyledView style={style.container}>
        <View style={style.items}>
          <AppSelectController
            control={control}
            title={'Selecione um servidor'}
            options={serverOptions}
            placeholder={'Selecione um servidor'}
            name={'server'}
          />
          <FormFieldErrors fieldError={errors.server} />

          <AppController
            control={control}
            name="gameName"
            label="Nome no jogo"
            placeholder="Seu nome no jogo"
          />
          <FormFieldErrors fieldError={errors.gameName} />

          <AppController
            control={control}
            name="tagLine"
            label="Tag line"
            placeholder="Sua tag line"
          />
          <FormFieldErrors fieldError={errors.tagLine} />
        </View>
        <StyledButton onPress={handleSubmit(onSubmit)}>Enviar</StyledButton>
      </StyledView>
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={hideSnackbar}
        action={
          {
            label: 'OK',
            onPress: () => {
              hideSnackbar()
            }
          }
        }
      >
        {updateSuccess ? snackbarFeedback['success'] : snackbarFeedback['error']}
      </Snackbar>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    marginTop: 16,
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  items: { gap: 16 }
})