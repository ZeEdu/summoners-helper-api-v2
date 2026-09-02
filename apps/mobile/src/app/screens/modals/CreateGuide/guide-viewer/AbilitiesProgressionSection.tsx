import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native"
import { List, MD3Theme, Text, useTheme } from "react-native-paper"

import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion"
import useChampionData from "../../../../../hooks/useChampion"
import { AbilitiesProgressionDto, indexToAbilityOption, keymapIndex, KeymapIndexType } from "../forms/AbilitiesProgressionForm"
import { keyFromLvlsBuilder, LvlKey, lvlsArrayBuilder } from "../forms/utils"

export default function AbilitiesProgressionSection({
  champion,
  abilitiesProgression
}: {
  champion: string,
  abilitiesProgression: AbilitiesProgressionDto
}) {
  const usePatch = usePatchVersion()
  const theme = useTheme()
  const styles = makeStyles(theme)

  const { championData, error, loading } = useChampionData(champion)

  const isSelected = (levelKey: LvlKey, index: number) => {
    const value = indexToAbilityOption[index as KeymapIndexType];
    return abilitiesProgression.abilitiesProgression[levelKey] === value
  };

  return (
    <List.Section>
      <List.Subheader>
        <Text variant='headlineSmall'>
          Progressão de abilidades
        </Text>
      </List.Subheader>
      <List.Item title='Descrição' description={abilitiesProgression.abilitiesProgressionDescription} />
      <View style={styles.headerContainer}>
        {
          loading && (
            <View>
              <Text>Carregando</Text>
            </View>
          )
        }

        {Boolean(error) && (
          <View>
            <Text>Um erro ocorreu no ao carregar os dados </Text>
          </View>
        )}
        {!!championData ? (
          <View style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
              {championData.spells.map((ability, index) => {
                const keymap = keymapIndex[index as KeymapIndexType];
                const uri = `https://ddragon.leagueoflegends.com/cdn/${usePatch.version}/img/spell/${championData.id}${keymap.toUpperCase()}.png`;

                return (
                  <View key={ability.id} style={styles.headerColumnsContainer}>
                    <Image style={styles.headerImage} source={{ uri }} />
                    <Text style={styles.headerTitle}>{ability.name}</Text>
                  </View>
                );
              })}
            </View>
            <ScrollView>
              <View style={styles.levelSelectionContainer}>
                {championData.spells.map((_, index) => {
                  return (
                    <FlatList
                      data={lvlsArrayBuilder()}
                      keyExtractor={(level) => level.toString()}
                      style={styles.list}
                      renderItem={({ item: level }) => {
                        return (
                          <View
                            style={[
                              styles.listItemContainer,
                              {
                                backgroundColor: isSelected(
                                  keyFromLvlsBuilder(level),
                                  index,
                                )
                                  ? theme.colors.onPrimaryContainer
                                  : theme.colors.onPrimary,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.listItemText,
                                {
                                  color: isSelected(keyFromLvlsBuilder(level), index)
                                    ? theme.colors.onPrimary
                                    : theme.colors.onPrimaryContainer,
                                },
                              ]}
                            >
                              {level}
                            </Text>
                          </View>
                        );
                      }}
                    />
                  );
                })}
              </View>
            </ScrollView>
          </View>

        ) : (
          <View>
            <Text>Nenhum campeão foi encontrado </Text>
          </View>
        )}
      </View>
    </List.Section>
  )
}

const makeStyles = ({ roundness }: MD3Theme) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      gap: 12,
      marginTop: 16,
    },
    headerContainer: {
      flexDirection: 'row',
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
      borderRadius: roundness,
    },
    headerTitle: {
      textAlign: 'center',
    },
    levelSelectionContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    list: {
      flex: 1,
    },
    listItemContainer: {
      marginHorizontal: 'auto',
      marginTop: 16,
      width: 64,
      height: 64,
      borderRadius: roundness,
      display: 'flex',
      justifyContent: 'center',
    },
    listItemText: {
      textAlign: 'center',
    },
  });
};