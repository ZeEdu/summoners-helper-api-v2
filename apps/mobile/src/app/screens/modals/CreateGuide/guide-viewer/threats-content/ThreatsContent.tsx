import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { ThreatsDto } from "../../forms/ThreatsForm";
import ThreatCard from "./threat-card/ThreatCard";

type Props = {
  threats: ThreatsDto
}

export default function ThreatsContent({ threats }: Props) {
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">
        {threats.threatsDescription}
      </Text>
      <FlatList
        data={threats.threats}
        renderItem={({ item: threat }) => (<ThreatCard threat={threat.threat} description={threat.description} />)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8
  }
})