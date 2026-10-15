import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { GuideSummonerSpellsDto } from '../../forms/GuideSpellsForm';
import SpellCard from './spell-card/SpellCard';

type SpellContentProps = {
  spells: GuideSummonerSpellsDto;
};

export default function SpellContent({ spells }: SpellContentProps) {
  return (
    <View style={styles.container}>
      <Text variant="bodySmall">{spells.spellsDescription}</Text>
      <View style={styles.spellCards}>
        <SpellCard spell={spells.firstSpell} />
        <SpellCard spell={spells.secondSpell} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8
  },
  spellCards: {
    gap: 8,
    marginBottom: 16,
  },
});