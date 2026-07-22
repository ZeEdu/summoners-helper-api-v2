import { FlatList, StyleSheet, Text, View } from "react-native"

type ApiFieldErrorsProps = {
  apiErrors: string[] | undefined
}

export default function ApiFieldErrors({ apiErrors }: ApiFieldErrorsProps) {
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