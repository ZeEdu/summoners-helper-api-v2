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

import { StyledView } from '@org/ui';

import { useAuthContext } from '../../../../contexts/auth/useAuth';
import useUserHasRiotBindedAccount from '../../../../contexts/auth/useUserHasRiotBindedAccount';
import useI18n from '../../../../contexts/i18n/useI18n';
import useTranslateScreenName from '../../../../contexts/i18n/useTranslateScreenName';
import { useThemeContext } from '../../../../providers/theme.provider';
import ChangeLanguageButton from './change-language-button/ChangeLanguageButton';

export default function Profile() {
  useTranslateScreenName('Profile')

  const i18n = useI18n();
  const theme = useTheme();
  const navigation = useNavigation();

  const themeContext = useThemeContext();

  const authContext = useAuthContext();
  const styles = makeStyles(theme);
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

  const toggleTheme = () => {
    themeContext.toggleTheme()
  }

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

              <Text variant="labelMedium">{i18n.t('profile.header.text')}</Text>
            </View>
          </View>

          <Divider />

          <Text variant="titleLarge" style={styles.title}>
            {i18n.t('profile.personalInfo.title')}
          </Text>

          <Card mode={'contained'}>
            <View style={styles.item}>
              <Text variant="labelMedium" style={styles.itemTitleText}>
                {i18n.t('profile.personalInfo.email')}
              </Text>

              <Text variant="bodyLarge">{email}</Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.item}>
              <Text variant="labelMedium" style={styles.itemTitleText}>
                {i18n.t('profile.personalInfo.username')}
              </Text>

              <Text variant="bodyLarge">{username}</Text>
            </View>
          </Card>

          <Text variant="titleLarge" style={styles.title}>
            {i18n.t('profile.riotAccount.title')}
          </Text>

          {userHasRiotBindedAccount ? (
            <Card mode={'contained'}>
              <View style={styles.item}>
                <Text variant="labelMedium" style={styles.itemTitleText}>
                  {i18n.t('profile.riotAccount.gameName')}
                </Text>

                <Text variant="bodyLarge">{gameName}</Text>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.item}>
                <Text variant="labelMedium" style={styles.itemTitleText}>
                  {i18n.t('profile.riotAccount.tagLine')}
                </Text>
                <Text variant="bodyLarge">{tagLine}</Text>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.item}>
                <Text variant="labelMedium" style={styles.itemTitleText}>
                  {i18n.t('profile.riotAccount.server')}
                </Text>
                <Text variant="bodyLarge">
                  {server && i18n.t(`riot.server.${server}`)}
                </Text>
              </View>
            </Card>
          ) : (
            <Card mode="outlined">
              <View style={styles.bindRiotAccountContainer}>
                <Text variant="titleLarge">
                  {i18n.t('profile.bindAccount.title')}
                </Text>

                <Text variant="labelMedium" style={styles.bindAccountHelpText}>
                  {i18n.t('profile.bindAccount.hint')}
                </Text>

                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('BindRiotAccount')}
                >
                  {i18n.t('profile.bindAccount.button')}
                </Button>
              </View>
            </Card>
          )}
        </View>

        <View style={styles.actionButtons}>
          <Button mode='contained' onPress={toggleTheme}>
            {i18n.t('profile.toggleTheme')}
          </Button>
          <ChangeLanguageButton />
        </View>
        <View style={styles.logOutContainer}>
          <Button
            buttonColor={theme.colors.tertiary}
            textColor={theme.colors.onTertiary}
            onPress={showDialog}
          >
            {i18n.t('profile.logout.button')}
          </Button>
        </View>
      </StyledView>

      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={closeDialog}
        >
          <Dialog.Title>
            {i18n.t('profile.logout.title')}
          </Dialog.Title>

          <Dialog.Content>
            <Text variant="bodyMedium">
              {i18n.t('profile.logout.content')}
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={closeDialog}>
              {i18n.t('general.no').toUpperCase()}
            </Button>
            <Button onPress={handleLogOut}>
              {i18n.t('general.yes').toUpperCase()}
            </Button>
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
        {i18n.t('profile.snackbar')}
      </Snackbar>
    </>
  );
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    container: {
      margin: 16,
      justifyContent: 'space-between',
      height: '100%',
    },
    userInfoContainer: {
      gap: 16
    },
    profileHeader: {
      flexDirection: 'row',
      gap: 16,
    },
    actionButtons: {
      gap: 16
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