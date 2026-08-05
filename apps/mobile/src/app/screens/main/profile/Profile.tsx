import Clipboard from '@react-native-clipboard/clipboard';
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import { Button, List, MD3Theme, Text } from "react-native-paper";

import { StyledButton, StyledView } from "@org/ui";

import { RIOT_SERVERS_LABEL } from '../../../../../../../libs/contracts/src';
import { useAuthContext } from "../../../../contexts/auth/useAuth";
import { MainTabsParamList, RootStackParamList } from "../../../navigation/types";

export type ProfileProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>

export default function Profile({ navigation }: ProfileProps) {
  const authContext = useAuthContext()
  const hasRiotInfo = authContext.user?.puuid

  const handleAccountBindind = () => {
    navigation.navigate('Modals', { screen: 'BindRiotAccount' })
  }

  const copyEmail = () => {
    if (!authContext.user) return null

    Clipboard.setString(authContext.user.email)
  }

  const handleChangeRiotAccount = () => {
    navigation.navigate('Modals', { screen: 'BindRiotAccount' })
  }

  return (
    <StyledView>
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
            <StyledButton style={{ marginHorizontal: 16 }} onPress={handleChangeRiotAccount}>Trocar conta Riot</StyledButton>
          </List.Section>
        ) : (
          <>
            <List.Section>
              <List.Subheader>Informações da conta Riot</List.Subheader>
            </List.Section>
            <View style={{
              marginTop: 12,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12
            }}>
              <Text>Nenhuma conta Riot vinculada ao Summoner's Helper</Text>
              <Button mode="contained" onPress={handleAccountBindind}>Vincular agora!</Button>
            </View>
          </>)
      }
    </StyledView>
  )
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    container: {
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
