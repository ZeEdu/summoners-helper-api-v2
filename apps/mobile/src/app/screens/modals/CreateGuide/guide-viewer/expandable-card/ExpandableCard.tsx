import { useState } from "react";
import { LayoutAnimation, Platform, StyleSheet, UIManager } from "react-native";
import { Card, Icon, IconButton, Text, useTheme } from "react-native-paper";
import FadeInView from "../../../../../../components/animated/FadeInView";

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  title: string,
  content: string
}

export default function ExpandableCard({ title, content }: Props) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setExpanded((previous) => !previous);
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={<Text variant="headlineSmall">{title}</Text>}
        left={() => <Icon source='shield-crown' size={24} color={theme.colors.primary} />}
        right={() => <IconButton icon={expanded ? 'chevron-up' : 'chevron-down'} onPress={toggleExpanded} />}
      />
      {
        expanded && (
          <Card.Content>
            <FadeInView>
              <Text variant="bodySmall">
                {content}
              </Text>
            </FadeInView>
          </Card.Content>
        )
      }
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    margin: 16
  }
})