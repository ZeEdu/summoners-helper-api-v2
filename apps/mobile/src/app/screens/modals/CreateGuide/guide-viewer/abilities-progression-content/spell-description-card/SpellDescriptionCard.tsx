import { ChampionDataDragonSpell } from "@org/contracts";
import { Image, StyleSheet, View } from "react-native";
import { Card, Chip, MD3Theme, Text, useTheme } from "react-native-paper";
import useDataDragonContext from "../../../../../../../contexts/data-dragon/useDataDragonContext";
import { keymapIndex, KeymapIndexType } from "../../../forms/AbilitiesProgressionForm";

type Props = {
  spell: ChampionDataDragonSpell,
  index: number,
  championId: string
}

export default function SpellDescriptionCard({ spell, index, championId }: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const dataDragon = useDataDragonContext()

  const keymap = keymapIndex[index as KeymapIndexType];
  const uri = `https://ddragon.leagueoflegends.com/cdn/${dataDragon.getPatch()}/img/spell/${championId}${keymap.toUpperCase()}.png`;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.contentContainer}>
          <View>
            <Image style={styles.image} source={{ uri }} />
          </View>
          <View style={styles.descriptionContainer}>
            <View style={styles.descriptionHeader}>
              <Chip style={styles.chip} textStyle={styles.chipText}>{keymap.toUpperCase()}</Chip>
              <Text variant="titleMedium" style={styles.chipLabel}>{spell.name}</Text>
            </View>
            <View style={styles.description}>
              <Text variant="bodySmall">{spell.description}</Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  )

}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceVariant, marginBottom: 8
    },
    contentContainer: {
      flexDirection: 'row', gap: 8
    },
    image: {
      width: 48, height: 48, borderRadius: 16, borderWidth: 2, borderColor: colors.primary
    },
    descriptionContainer: { flex: 1, gap: 8 },
    descriptionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    chip: { backgroundColor: colors.primaryContainer },
    chipText: { color: colors.onPrimaryContainer },
    chipLabel: { color: colors.primary },
    description: { flex: 1 },
  })
}