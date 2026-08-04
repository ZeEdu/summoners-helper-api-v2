import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Dialog, Portal, Snackbar, TextInput, TouchableRipple } from 'react-native-paper';

import { RIOT_SERVERS, RIOT_SERVERS_LABEL, UpdateUserProfileDto, updateUserProfileSchema } from '@org/contracts';
import { StyledButton, StyledView } from '@org/ui';

import AppController from '../../../components/forms/AppController';
import FormFieldErrors from '../../../components/forms/FormFieldErrors';
import { useAuthContext } from '../../../contexts/auth/useAuth';
import { ApiService } from '../../../services/api/api.service';
import { ModalStackParamList } from '../../navigation/types';
import RadialSelectModal from './RadialSelectModal';

const serverOptions: { value: RIOT_SERVERS; label: RIOT_SERVERS_LABEL }[] = [
  {
    value: RIOT_SERVERS.BR1,
    label: RIOT_SERVERS_LABEL.BR1,
  },
  {
    value: RIOT_SERVERS.EUN1,
    label: RIOT_SERVERS_LABEL.EUN1,
  },
  {
    value: RIOT_SERVERS.EUW1,
    label: RIOT_SERVERS_LABEL.EUW1,
  },
  {
    value: RIOT_SERVERS.JP1,
    label: RIOT_SERVERS_LABEL.JP1,
  },
  {
    value: RIOT_SERVERS.KR,
    label: RIOT_SERVERS_LABEL.KR,
  },
  {
    value: RIOT_SERVERS.LA1,
    label: RIOT_SERVERS_LABEL.LA1,
  },
  {
    value: RIOT_SERVERS.LA2,
    label: RIOT_SERVERS_LABEL.LA2,
  },
  {
    value: RIOT_SERVERS.ME1,
    label: RIOT_SERVERS_LABEL.ME1,
  },
  {
    value: RIOT_SERVERS.NA1,
    label: RIOT_SERVERS_LABEL.NA1,
  },
  {
    value: RIOT_SERVERS.OC1,
    label: RIOT_SERVERS_LABEL.OC1,
  },
  {
    value: RIOT_SERVERS.RU,
    label: RIOT_SERVERS_LABEL.RU,
  },
  {
    value: RIOT_SERVERS.SG2,
    label: RIOT_SERVERS_LABEL.SG2,
  },
  {
    value: RIOT_SERVERS.TR1,
    label: RIOT_SERVERS_LABEL.TR1,
  },
  {
    value: RIOT_SERVERS.TW2,
    label: RIOT_SERVERS_LABEL.TW2,
  },
  {
    value: RIOT_SERVERS.VN2,
    label: RIOT_SERVERS_LABEL.VN2,
  },
] as const;

const resolver = zodResolver(updateUserProfileSchema);

type Props = NativeStackScreenProps<ModalStackParamList, 'BindRiotAccount'>

export default function BindRiotAccount({ navigation }: Props) {
  const authContext = useAuthContext()

  const defaultServerValue = RIOT_SERVERS.NA1
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<UpdateUserProfileDto>({
    resolver,
    defaultValues: {
      server: defaultServerValue,
      gameName: 'MunchyPunchyLOL',
      tagLine: 'TTV1'
    },
  });

  const [server, setServer] = useState<RIOT_SERVERS>(defaultServerValue);
  const [serverInputLabel, setServerInputLabel] = useState<string>(defaultServerValue)

  const [modalVisible, setModalVisible] = useState(false)
  const [visibleSnackbar, setVisibleSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')

  const hideSnackbar = () => {
    setVisibleSnackbar(false)
  }

  const handleSelectPress = () => {
    setModalVisible(true)
  }

  const makeInputLabel = () => {
    const label = serverOptions.find((option) => option.value === server)?.label
    setServerInputLabel(label!)
  }

  const onCancel = () => {
    setServer(defaultServerValue)
    setModalVisible(false)

    makeInputLabel()
  }

  const dismissWithValue = () => {
    setModalVisible(false)
    makeInputLabel()
    if (server) {
      setValue('server', server)
    }
  }

  const onSubmit = async (value: UpdateUserProfileDto) => {
    try {
      await ApiService.Users.updateProfile(value)
      await authContext.me()
      setSnackbarMessage('Dados atualizados com sucesso')

      setTimeout(() => {
        navigation.goBack()
      }, 5_000)
    } catch (_) {
      setSnackbarMessage('Um erro ocorreu. Tente novamente')
      setVisibleSnackbar(true)
    }
  }

  return (
    <>
      <StyledView style={style.container}>
        <View style={style.items}>
          <Portal>
            <Dialog visible={modalVisible} onDismiss={onCancel}>
              <Dialog.Content>
                <RadialSelectModal title='Selecione um servidor' options={serverOptions} state={server} setState={setServer} dismiss={onCancel} dismissWithValue={dismissWithValue} />
              </Dialog.Content>
            </Dialog>
          </Portal>
          <TouchableRipple onPress={handleSelectPress} >
            <TextInput
              mode="outlined"
              label={serverInputLabel}
              editable={false}
              right={
                <TextInput.Icon
                  icon="menu-down"
                  onPress={handleSelectPress}
                />}
            ></TextInput>
          </TouchableRipple>
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
        {snackbarMessage}
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