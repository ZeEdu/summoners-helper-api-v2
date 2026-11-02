import { ActivityIndicator, StyleSheet, View } from "react-native";
import { MD3Colors, Text } from "react-native-paper";

import { StyledView } from "@org/ui";
import useI18n from "../../../contexts/i18n/useI18n";

export default function Loading() {
  const i18n = useI18n()

  return (
    <StyledView style={styles.container}>
      <View>
        <ActivityIndicator animating={true} size={'large'} color={MD3Colors.primary100} />
        <Text style={styles.text}>{i18n.t('loadingFeedback.text')}</Text>
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