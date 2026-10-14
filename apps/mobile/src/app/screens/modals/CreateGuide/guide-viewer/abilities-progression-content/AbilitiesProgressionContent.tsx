import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, MD3Theme, Text, useTheme } from "react-native-paper";
import useDataDragonContext from "../../../../../../contexts/data-dragon/useDataDragonContext";
import useChampionData from "../../../../../../hooks/useChampion";
import { AbilitiesProgressionDto } from "../../forms/AbilitiesProgressionForm";
import SpellDescriptionCard from "./spell-description-card/SpellDescriptionCard";
import AbilitiesProgressionBody from "./table/body/AbilitiesProgressionBody";
import AbilitiesProgressionHeader from "./table/header/AbilitiesProgressionHeader";

type Props = {
  abilitiesProgression: AbilitiesProgressionDto;
  championId: string;
}

export default function AbilitiesProgressionContent({ abilitiesProgression, championId }: Props) {
  const theme = useTheme()
  const { championData, error, loading } = useChampionData(championId)
  const dataDragon = useDataDragonContext()

  const styles = makeStyles(theme)

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
        <Text>Carregando...</Text>
      </View>
    )
  }


  if (!championData || error) {
    return (
      <View>
        <Text>Um erro ocorreu ao tentar carregar os dados</Text>
      </View>
    )

  }

  return (
    <>
      <FlatList
        data={championData?.spells}
        contentContainerStyle={styles.spellContentContainer}
        renderItem={(({ item: spell, index }) => (
          <SpellDescriptionCard
            spell={spell}
            index={index}
            championId={championId}
          />
        ))}
      />

      <View style={styles.abilitiesProgressionContainer}>
        <AbilitiesProgressionHeader spells={championData.spells} championId={championData.id} />
        <AbilitiesProgressionBody spells={championData.spells} abilitiesProgression={abilitiesProgression} />
      </View >
    </>
  )
}


const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    spellContentContainer: { gap: 4 },
    abilitiesProgressionContainer: {
      gap: 8
    }
  })
}