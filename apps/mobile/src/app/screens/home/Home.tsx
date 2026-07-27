import { StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';
import { useAuthContext } from '../../../contexts/auth/useAuth';
import { MD3Theme, useTheme } from 'react-native-paper';
import { ThemeContext } from 'apps/mobile/src/providers/theme.provider';
import { AppButton, AppText } from '@org/ui';

export default function Home() {
  const authContext = useAuthContext();
  const themeContext = useContext(ThemeContext)
  const theme = useTheme()

  const handleLogout = () => {
    authContext.logout();
  };

  const toggleTheme = () => {
    themeContext.toggleTheme()
  }

  const style = makeStyles(theme)

  return (
    <View style={style.container}>
      <View>
        <AppText>Email: {authContext?.user?.email}</AppText>
        <AppText>Username: {authContext?.user?.username}</AppText>
      </View>
      <View style={style.buttonsWrapper}>
        <AppButton onPress={toggleTheme}>Trocar tema</AppButton>
      </View>
      <View style={style.buttonsWrapper}>
        <AppButton onPress={handleLogout}>Deslogar</AppButton>
      </View>
    </View>
  );
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background
    },
    buttonsWrapper: {
      display: 'flex',
      flexDirection: 'row',
      gap: 5,
    },
    buttons: {},
  })
}
