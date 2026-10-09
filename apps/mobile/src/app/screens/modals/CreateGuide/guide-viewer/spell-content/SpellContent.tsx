import { StyleSheet, View } from 'react-native';
import SpellCard from './spell-card/SpellCard';
import { Divider, Text } from 'react-native-paper';
import { GuideSummonerSpellsDto } from '../../forms/GuideSpellsForm';

type SpellContentProps = {
  spells: GuideSummonerSpellsDto;
};

export default function SpellContent({ spells }: SpellContentProps) {
  return (
    <>
      <View style={styles.spellCards}>
        <SpellCard spell={spells.firstSpell} />
        <Divider />
        <SpellCard spell={spells.secondSpell} />
      </View>
      <Text variant="bodySmall">{spells.spellsDescription}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  spellCards: {
    gap: 8,
    marginBottom: 16,
  },
});