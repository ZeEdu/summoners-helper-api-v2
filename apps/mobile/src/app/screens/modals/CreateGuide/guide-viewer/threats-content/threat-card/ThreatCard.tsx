import { StyleSheet, View } from "react-native"
import { Card, MD3Theme, Text, useTheme } from "react-native-paper"
import useDataDragonContext from "../../../../../../../contexts/data-dragon/useDataDragonContext"
import ThreatImage from "./threat-image/ThreatImage"

type Props = {
  threat: string,
  description: string
}

export default function ThreatCard({ threat, description }: Props) {
  const dataDragon = useDataDragonContext()
  const theme = useTheme()
  const styles = makeStyles(theme)

  const champion = dataDragon.getChampion(threat)

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View>
          <ThreatImage championId={threat} />
        </View>
        <View style={styles.container}>
          <Text variant="titleMedium" style={styles.title}>{champion.name}</Text>
          <Text style={styles.description} variant="bodyMedium">{description}</Text>
        </View>
      </Card.Content>
    </Card>
  )
}


const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceVariant
    },
    cardContent: {
      flexDirection: 'row',
      gap: 8
    },
    title: {
      color: colors.primary
    },
    container: {
      flex: 1
    },
    description: {
      flex: 1,
      color: colors.onSurface
    }
  })
}