import { FieldError } from "react-hook-form"
import { StyleSheet, View } from "react-native"

import { StyledText } from "@org/ui"
import { MD3Theme, useTheme } from "react-native-paper"

export default function FormFieldErrors({ fieldError }: { fieldError: FieldError | undefined }) {
  if (!fieldError) {
    return
  }

  const theme = useTheme()
  const styles = makeStyles(theme)

  return (
    <View style={styles.container}>
      <StyledText style={styles.text}>{fieldError.message}</StyledText>
    </View>
  )
}

const makeStyles = ({ colors, fonts }: MD3Theme) => {

  return StyleSheet.create({
    container: {},
    text: {
      color: colors.onError
    }
  })
}