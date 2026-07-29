import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useAuthContext } from '../../../contexts/auth/useAuth';
import { MD3Theme, useTheme } from 'react-native-paper';
import { useThemeContext } from 'apps/mobile/src/providers/theme.provider';
import { StyledButton, StyledText } from '@org/ui';

export default function Home() {
  const authContext = useAuthContext();
  const themeContext = useThemeContext()
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
        <StyledText>Email: {authContext?.user?.email}</StyledText>
        <StyledText>Username: {authContext?.user?.username}</StyledText>
      </View>
      <View style={style.buttonsWrapper}>
        <StyledButton onPress={toggleTheme}>Trocar tema</StyledButton>
      </View>
      <View style={style.buttonsWrapper}>
        <StyledButton onPress={handleLogout}>Deslogar</StyledButton>
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
