import { FieldError } from "react-hook-form"
import { StyleSheet, View } from "react-native"

import { StyledText } from "@org/ui"
import { MD3Theme, useTheme } from "react-native-paper"

export default function FormFieldErrors({ fieldError }: { fieldError: FieldError | undefined }) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  if (!fieldError) {
    return
  }

  return (
    <View style={styles.container}>
      <StyledText style={styles.text}>* {fieldError.message}</StyledText>
    </View>
  )
}

const makeStyles = ({ colors, fonts }: MD3Theme) => {
  return StyleSheet.create({
    container: {
      margin: 8,
      marginLeft: 0
    },
    text: {
      color: colors.error
    }
  })
}