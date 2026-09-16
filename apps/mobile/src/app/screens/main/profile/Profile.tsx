import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from "@react-navigation/native";
import { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { Button, Dialog, List, Portal, Snackbar, Text, useTheme } from "react-native-paper";

import { RIOT_SERVERS_LABEL } from '@org/contracts';
import { StyledButton, StyledView } from "@org/ui";

import { useAuthContext } from "../../../../contexts/auth/useAuth";

export default function Profile() {
  const theme = useTheme()
  const navigation = useNavigation()
  const authContext = useAuthContext()
  const styles = makeStyle()

  const hasRiotInfo = authContext.user?.puuid

  const [isDialogVisible, setIsDialogVisible] = useState(false)

  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false)

  const handleAccountBindind = () => {
    navigation.navigate('BindRiotAccount')
  }

  const copyEmail = () => {
    if (!authContext.user) return null

    Clipboard.setString(authContext.user.email)
  }

  const handleChangeRiotAccount = () => {
    navigation.navigate('BindRiotAccount')
  }

  const handleLogOut = async () => {
    try {
      await authContext.logout()
    } catch {
      showSnackbar()
    }
  }

  const showDialog = () => {
    setIsDialogVisible(true)
  }

  const closeDialog = () => {
    setIsDialogVisible(false)
  }

  const showSnackbar = () => {
    setIsSnackbarVisible(true)
  }

  const closeSnackbar = () => {
    setIsSnackbarVisible(false)
  }

  return (
    <>
      <StyledView style={styles.container}>
        <View>
          <List.Section>
            <List.Subheader>Informações pessoais</List.Subheader>
            <List.Item
              onPress={copyEmail}
              title="Email"
              description={authContext.user?.email}
            />
            <List.Item
              title="Username"
              description={authContext.user?.username}
            />
          </List.Section>
          {
            hasRiotInfo ? (
              <List.Section>
                <List.Subheader>Informações da conta Riot</List.Subheader>
                <List.Item
                  title="Nome no jogo"
                  description={authContext.user?.gameName}
                />
                <List.Item
                  title="Tag line"
                  description={authContext.user?.tagLine}
                />
                {authContext.user?.server && (
                  <List.Item
                    title="Servidor"
                    description={RIOT_SERVERS_LABEL[authContext.user?.server]}
                  />
                )}
                <StyledButton style={styles.changeRiotAccountButton} onPress={handleChangeRiotAccount}>Trocar conta Riot</StyledButton>
              </List.Section>
            ) : (
              <>
                <List.Section>
                  <List.Subheader>Informações da conta Riot</List.Subheader>
                </List.Section>
                <View style={styles.bindRiotAccountContainer}>
                  <Text>Nenhuma conta Riot vinculada ao Summoner's Helper</Text>
                  <Button mode="contained" onPress={handleAccountBindind}>Vincular agora!</Button>
                </View>
              </>
            )
          }
        </View>
        <View style={styles.logOutButtonContainer}>
          <StyledButton
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
            onPress={showDialog}
          >
            Deslogar
          </StyledButton>
        </View>
      </StyledView>

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={closeDialog}>
          <Dialog.Title>Você Tem certeza</Dialog.Title>
          <Dialog.Content>
            <Text variant='bodyMedium'>Você tem certeza que quer deslogar?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>NÃO</Button>
            <Button onPress={handleLogOut}>SIM</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={closeSnackbar}
        action={
          {
            label: 'OK',
            onPress: () => {
              closeSnackbar()
            }
          }
        }
      >
        Não foi possivel deslogar. Tente novamente
      </Snackbar>
    </>
  )
}

const makeStyle = () => {
  return StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      height: '100%'
    },
    changeRiotAccountButton: {
      marginHorizontal: 16
    },
    bindRiotAccountContainer: {
      marginTop: 12,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12
    },
    logOutButtonContainer: {
      marginBottom: 16,
      marginHorizontal: 16,
    }
  })
}