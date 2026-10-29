import { FlatList, StyleSheet, View } from "react-native"
import { Card, MD3Theme, Text, useTheme } from "react-native-paper"
import { ChampionDataDragonSpell } from "../../../../../../../../../../../libs/contracts/src"
import { AbilitiesProgressionDto, indexToAbilityOption, KeymapIndexType } from "../../../../forms/AbilitiesProgressionForm"
import { keyFromLvlsBuilder, LvlKey, lvlsArrayBuilder } from "../../../../forms/utils"

type Props = {
  spells: ChampionDataDragonSpell[],
  abilitiesProgression: AbilitiesProgressionDto;
}

export default function AbilitiesProgressionBody({ spells, abilitiesProgression }: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const isSelected = (levelKey: LvlKey, index: number) => {
    const value = indexToAbilityOption[index as KeymapIndexType];
    return abilitiesProgression.abilitiesProgression[levelKey] === value
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {
          spells.map((_, index) => {
            return (
              <FlatList
                data={lvlsArrayBuilder()}
                contentContainerStyle={styles.contentContainer}
                keyExtractor={(level) => level.toString()}
                renderItem={({ item: level }) => {
                  return (
                    <View style={[
                      styles.itemContainer,
                      {
                        backgroundColor: isSelected(keyFromLvlsBuilder(level), index) ? theme.colors.primary : theme.colors.surface,
                      }
                    ]}>
                      <Text
                        variant="labelLarge"
                        style={{
                          color: isSelected(keyFromLvlsBuilder(level), index) ? theme.colors.onPrimary : theme.colors.onSurface
                        }}>
                        {level}
                      </Text>
                    </View>
                  )
                }}
              />
            )
          })
        }
      </Card.Content>
    </Card>
  )
}

const makeStyles = ({ colors, roundness }: MD3Theme) => {
  return StyleSheet.create({
    card: { backgroundColor: colors.surfaceVariant },
    cardContent: { flexDirection: 'row', gap: 8 },
    contentContainer: { gap: 8 },
    itemContainer: {
      alignItems: 'center',
      borderRadius: roundness,
      padding: 8
    }
  })
}