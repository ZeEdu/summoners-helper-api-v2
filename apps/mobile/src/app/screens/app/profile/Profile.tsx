import { StyledView } from "@org/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuthContext } from "apps/mobile/src/contexts/auth/useAuth";
import { StyleSheet, View } from "react-native";
import { Button, List, MD3Theme, Text } from "react-native-paper";
import { AppStackParamList, RootStackParamList } from "../../../navigation/types";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";

type Props = CompositeScreenProps<
  BottomTabScreenProps<AppStackParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>

export default function Profile({ navigation }: Props) {
  const authContext = useAuthContext()
  const hasRiotInfo = authContext.user?.puuid

  const handleAccountBindind = () => {
    navigation.navigate('Modals', { screen: 'BindRiotAccount' })
  }

  return (
    <StyledView>
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
