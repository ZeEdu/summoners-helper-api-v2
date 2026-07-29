import { StyledView } from "@org/ui";
import { useAuthContext } from "apps/mobile/src/contexts/auth/useAuth";
import { StyleSheet, View } from "react-native";
import { Button, List, MD3Theme, Text, useTheme } from "react-native-paper";

export default function Profile() {
  const theme = useTheme()
  const authContext = useAuthContext()
  const style = makeStyles(theme)

  const hasRiotInfo = authContext.user?.puuid

  const handleAccountBindind = () => {
    // Navegar para uma outra tela


  }

  return (
    <StyledView >
      <List.Section>
        <List.Subheader>Informações pessoais</List.Subheader>
        <List.Item
          title="Email"
          description={authContext.user?.email}
        ></List.Item>
        <List.Item
          title="Username"
          description={authContext.user?.username}
        ></List.Item>
      </List.Section>
      {
        hasRiotInfo ? (
          <List.Section>
            <List.Subheader>Informações da conta Riot</List.Subheader>
            <List.Item
              title="Username"
              description={authContext.user?.username}
            >
            </List.Item>
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
