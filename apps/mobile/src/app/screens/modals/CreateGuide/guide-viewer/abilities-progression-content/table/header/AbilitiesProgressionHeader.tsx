import { ChampionDataDragonSpell } from "@org/contracts";
import { Image, StyleSheet, View } from "react-native";
import { Card, MD3Theme, Text, useTheme } from "react-native-paper";
import useDataDragonContext from "../../../../../../../../contexts/data-dragon/useDataDragonContext";
import { keymapIndex, KeymapIndexType } from "../../../../forms/AbilitiesProgressionForm";

type Props = {
  spells: ChampionDataDragonSpell[];
  championId: string;
}
export default function AbilitiesProgressionHeader({
  spells,
  championId
}: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const dataDragon = useDataDragonContext()

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {
          spells.map(({ id, name }, index) => {
            const keymap = keymapIndex[index as KeymapIndexType];
            const uri = `https://ddragon.leagueoflegends.com/cdn/${dataDragon.getPatch()}/img/spell/${championId}${keymap.toUpperCase()}.png`;

            return (
              <View key={id} style={styles.headerColumnsContainer}>
                <Image style={styles.headerImage} source={{ uri }} />
                <Text variant="labelMedium" style={styles.headerTitle}>{name}</Text>
              </View>)
          })
        }
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
      flexDirection: 'row'
    },
    headerColumnsContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 8,
    },
    headerImage: {
      width: 64,
      height: 64,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.primary
    },
    headerTitle: {
      textAlign: 'center',
    },
  })
}