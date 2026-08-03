import { FieldError } from "react-hook-form"
import { StyleSheet, View } from "react-native"

import { StyledText } from "@org/ui"

export default function FormFieldErrors({ fieldError }: { fieldError: FieldError | undefined }) {
  if (!fieldError) {
    return
  }

  return <View style={styles.container}>
    <StyledText style={styles.text}>{fieldError.message}</StyledText>
  </View>
}

const styles = StyleSheet.create({
  container: {},
  text: {}
})