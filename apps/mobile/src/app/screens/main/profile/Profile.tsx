import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Divider,
  MD3Theme,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';

import { getServerLabel } from '@org/contracts';
import { StyledView } from '@org/ui';

import { useAuthContext } from '../../../../contexts/auth/useAuth';
import useUserHasRiotBindedAccount from '../../../../contexts/auth/useUserHasRiotBindedAccount';

export default function Profile() {
  const theme = useTheme();
  const navigation = useNavigation();
  const authContext = useAuthContext();
  const styles = makeStyle(theme);
  const userHasRiotBindedAccount = useUserHasRiotBindedAccount();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  const { username, email, gameName, tagLine, server } = authContext.user!;
  const avatarTextLabel = username.slice(0, 2).toUpperCase() || '';

  const handleLogOut = async () => {
    try {
      await authContext.logout();
    } catch {
      showSnackbar();
    }
  };

  const showDialog = () => {
    setIsDialogVisible(true);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
  };

  const showSnackbar = () => {
    setIsSnackbarVisible(true);
  };

  const closeSnackbar = () => {
    setIsSnackbarVisible(false);
  };

  return (
    <>
      <StyledView style={styles.container}>
        <View style={styles.userInfoContainer}>
          <View style={styles.profileHeader}>
            <Avatar.Text size={48} label={avatarTextLabel} />
            <View>
              <Text variant="titleLarge">{username}</Text>
              <Text variant="labelMedium">Perfil do Summoner's Helper</Text>
            </View>
          </View>

          <Divider />

          <Text variant="titleLarge" style={styles.title}>
            Informações pessoais
          </Text>

          <Card mode={'contained'}>
            <View style={styles.item}>
              <Text variant="labelMedium" style={styles.itemTitleText}>
                Email
              </Text>

              <Text variant="bodyLarge">{email}</Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.item}>
              <Text variant="labelMedium" style={styles.itemTitleText}>
                Username
              </Text>

              <Text variant="bodyLarge">{username}</Text>
            </View>
          </Card>

          <Text variant="titleLarge" style={styles.title}>
            Conta Riot
          </Text>

          {userHasRiotBindedAccount ? (
            <Card mode={'contained'}>
              <View style={styles.item}>
                <Text variant="labelMedium" style={styles.itemTitleText}>
                  Nome no Jogo
                </Text>
                <Text variant="bodyLarge">{gameName}</Text>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.item}>
                <Text variant="labelMedium" style={styles.itemTitleText}>
                  TagLine
                </Text>
                <Text variant="bodyLarge">{tagLine}</Text>
              </View>

              <View style={styles.item}>
                <Text variant="labelMedium" style={styles.itemTitleText}>
                  Servidor
                </Text>
                <Text variant="bodyLarge">
                  {server && getServerLabel(server)}
                </Text>
              </View>
            </Card>
          ) : (
            <Card mode="outlined">
              <View style={styles.bindRiotAccountContainer}>
                <Text variant="titleLarge">Nenhuma conta vinculada</Text>

                <Text variant="labelMedium" style={styles.bindAccountHelpText}>
                  Associe sua conta Riot para conectar seus dados de jogo ao
                  perfil.
                </Text>

                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('BindRiotAccount')}
                >
                  Vincular conta Riot
                </Button>
              </View>
            </Card>
          )}
        </View>
        <View style={styles.logOutContainer}>
          <Button
            buttonColor={theme.colors.tertiary}
            textColor={theme.colors.onTertiary}
            onPress={showDialog}
          >
            Sair da conta
          </Button>
        </View>
      </StyledView>

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={closeDialog}>
          <Dialog.Title>Você Tem certeza</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Você tem certeza que quer deslogar?
            </Text>
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
        action={{
          label: 'OK',
          onPress: () => {
            closeSnackbar();
          },
        }}
      >
        Não foi possivel deslogar. Tente novamente
      </Snackbar>
    </>
  );
}

const makeStyle = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    container: {
      margin: 16,
      justifyContent: 'space-between',
      height: '100%',
    },
    userInfoContainer: { gap: 16 },
    profileHeader: {
      flexDirection: 'row',
      gap: 16,
    },
    title: { color: colors.primary },
    changeRiotAccountButton: {
      marginHorizontal: 16,
    },
    bindRiotAccountContainer: {
      margin: 16,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    bindAccountHelpText: { textAlign: 'center' },
    logOutContainer: {
      marginBottom: 32,
      marginHorizontal: 16,
    },
    card: {
      borderRadius: 8,
      overflow: 'hidden',
    },
    item: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      gap: 6,
    },
    itemTitleText: {
      color: colors.onSurfaceVariant,
    },
    divider: {
      backgroundColor: colors.onSurfaceVariant,
    },
  });
};