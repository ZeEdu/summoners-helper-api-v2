import { StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-paper"

import { StyledView } from "@org/ui"

import useDataDragonContext from "../../../contexts/data-dragon/useDataDragonContext"
import useI18n from "../../../contexts/i18n/useI18n"

export default function Error() {
  const useDataDragon = useDataDragonContext()
  const i18n = useI18n()

  return (
    <StyledView style={styles.container}>
      <View>
        <Text style={styles.text}>{i18n.t('errorFeedback.text')}</Text>
        <Button mode='contained' onPress={() => {
          useDataDragon.reload()
        }}
        >
          {i18n.t('errorFeedback.button')}
        </Button>
      </View>
    </StyledView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    padding: 16
  }
})