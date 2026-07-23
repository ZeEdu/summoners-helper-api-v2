import { FlatList, StyleSheet, View } from "react-native"
import { Text } from "@org/ui/text"

type ApiFieldErrorsProps = {
  apiErrors: string[] | undefined
}

export function ApiFieldErrors({ apiErrors }: ApiFieldErrorsProps) {
  if (!apiErrors?.length) {
    return
  }

  return <View style={styles.container}>
    <FlatList data={apiErrors} renderItem={({ item }) => {
      return <Text style={styles.text}>{item}</Text>
    }} />
  </View>
}

const styles = StyleSheet.create({
  container: {},
  text: {}
})