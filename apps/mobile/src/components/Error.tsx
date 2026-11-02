import { PropsWithChildren } from "react"
import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import useI18n from "../contexts/i18n/useI18n"

export default function Error({ children }: PropsWithChildren) {
  const i18n = useI18n()
  return (
    <View
      style={styles.container}
    >
      {
        children ?? (
          <Text style={styles.fallbackText}>
            {i18n.t('error.text')}
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