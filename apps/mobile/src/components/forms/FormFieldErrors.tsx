import { StyledText } from "@org/ui"
import { FieldError } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"

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