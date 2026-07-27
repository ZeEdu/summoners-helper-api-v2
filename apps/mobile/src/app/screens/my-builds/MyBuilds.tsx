import { AppText } from "@org/ui"
import { StyleSheet, View } from "react-native"
import { MD3Theme, useTheme } from "react-native-paper"

export default function MyBuilds() {
  const theme = useTheme()
  const style = makeStyles(theme)
  return (
    <View style={style.container}>
      <AppText>Minhas Builds</AppText>
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
