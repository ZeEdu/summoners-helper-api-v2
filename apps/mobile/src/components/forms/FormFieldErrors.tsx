import { AppText } from "@org/ui"
import { FieldError } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"

export default function FormFieldErrors({ fieldError }: { fieldError: FieldError | undefined }) {
  if (!fieldError) {
    return
  }

  return <View style={styles.container}>
    <AppText style={styles.text}>{fieldError.message}</AppText>
  </View>
}

const styles = StyleSheet.create({
  container: {},
  text: {}
})