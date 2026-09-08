import { PropsWithChildren } from "react"
import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"

export default function Error({ children }: PropsWithChildren) {
  return (
    <View
      style={styles.container}
    >
      {
        children ?? (
          <Text style={styles.fallbackText}>
            Ops! Um erro ocorreu... Tente novamente mais tarde!
          </Text>
        )
      }
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  fallbackText: {
    textAlign: 'center'
  }
})