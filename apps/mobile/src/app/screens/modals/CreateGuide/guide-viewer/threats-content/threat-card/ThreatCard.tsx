import { StyleSheet, View } from "react-native"
import { Card, MD3Theme, Text, useTheme } from "react-native-paper"
import useDataDragonContext from "../../../../../../../contexts/data-dragon/useDataDragonContext"
import ThreatImage from "./threat-image/ThreatImage"

type Props = {
  threat: string,
  description: string
}

export default function ThreatCard({ threat, description }: Props) {
  console.log({ description });

  const dataDragon = useDataDragonContext()
  const theme = useTheme()
  const styles = makeStyles(theme)

  const champion = dataDragon.getChampion(threat)

  return (
    <Card style={{ backgroundColor: theme.colors.surfaceVariant }}>
      <Card.Content style={styles.cardContent}>
        <View>
          <ThreatImage championId={threat} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" style={styles.title}>{champion.name}</Text>
          <Text style={styles.description} variant="bodyMedium">{description}</Text>
        </View>
      </Card.Content>
    </Card>
  )
}


const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    cardContent: {
      flexDirection: 'row',
      gap: 8
    },
    title: {
      color: colors.primary
    },
    description: {
      flex: 1,
      color: colors.onSurface
    }
  })
}