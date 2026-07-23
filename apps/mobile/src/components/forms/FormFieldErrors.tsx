import { FieldError } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import { Text } from "libs/ui/text"

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