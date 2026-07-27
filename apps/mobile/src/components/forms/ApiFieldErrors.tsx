import { AppText } from "@org/ui"
import { FlatList, StyleSheet, View } from "react-native"

type ApiFieldErrorsProps = {
  apiErrors: string[] | undefined
}

export default function ApiFieldErrors({ apiErrors }: ApiFieldErrorsProps) {
  if (!apiErrors?.length) {
    return
  }

  return <View style={styles.container}>
    <FlatList data={apiErrors} renderItem={({ item }) => {
      return <AppText style={styles.text}>{item}</AppText>
    }} />
  </View>
}

const styles = StyleSheet.create({
  container: {},
  text: {}
})