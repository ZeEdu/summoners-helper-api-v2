import { StyledText } from "@org/ui"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { CompositeScreenProps } from "@react-navigation/native"
import { StyleSheet, View } from "react-native"
import { MD3Theme, useTheme } from "react-native-paper"
import { MainTabsParamList, RootStackParamList } from "../../../navigation/types"

export type MyBuildsProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'MyBuilds'>,
  NativeStackScreenProps<RootStackParamList>
>

export default function MyBuilds(props: MyBuildsProps) {
  const theme = useTheme()
  const style = makeStyles(theme)
  return (
    <View style={style.container}>
      <StyledText>Minhas Builds</StyledText>
    </View>
  )
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
