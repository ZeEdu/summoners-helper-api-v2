import { ActivityIndicator, StyleSheet } from "react-native";

import { StyledView } from "@org/ui";
import { Text } from "react-native-paper";
import useI18n from "../../../contexts/i18n/useI18n";

type Props = {
  i18nKey?: string
}

export default function Loading({ i18nKey }: Props) {
  const i18n = useI18n()

  return (
    <StyledView style={styles.container}>
      <ActivityIndicator animating={true} size={'large'} />
      <Text variant="labelSmall" style={styles.text}>{i18n.t(i18nKey ? `loadingFeedback.${i18nKey}` : 'loadingFeedback.default')}</Text>
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