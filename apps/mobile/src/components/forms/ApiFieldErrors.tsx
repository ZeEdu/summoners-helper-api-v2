import { StyledText } from "@org/ui"
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
      return <StyledText style={styles.text}>{item}</StyledText>
    }} />
  </View>
}

const styles = StyleSheet.create({
  container: {},
  text: {}
})