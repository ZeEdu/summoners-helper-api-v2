import { FieldError } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"

export function FormFieldErrors({ fieldError }: { fieldError: FieldError | undefined }) {
  if (!fieldError) {
    return
  }

  return <View style={styles.container}>
    <Text style={styles.text}>{fieldError.message}</Text>
  </View>
}

const styles = StyleSheet.create({
  container: {},
  text: {}
})