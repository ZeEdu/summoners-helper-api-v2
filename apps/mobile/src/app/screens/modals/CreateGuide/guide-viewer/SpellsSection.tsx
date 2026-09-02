import { Avatar, List, Text } from "react-native-paper";

import useDataDragonContext from "../../../../../contexts/data-dragon/useDataDragonContext";
import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import { GuideSummonerSpellsDto } from "../forms/GuideSpellsForm";

export default function SpellsSection({ guideSummonerSpells }: { guideSummonerSpells: GuideSummonerSpellsDto }) {
  return (
    <List.Section>
      <List.Subheader>
        <Text variant='headlineSmall'>
          Magias
        </Text>
      </List.Subheader>
      <SpellItem spellId={guideSummonerSpells.firstSpell} />
      <SpellItem spellId={guideSummonerSpells.secondSpell} />
      <List.Item title={'Descrição'} description={guideSummonerSpells.spellsDescription} />
    </List.Section>
  )
}

function SpellItem({ spellId }: {
  spellId: string
}) {
  const useDataDragon = useDataDragonContext();
  const usePatch = usePatchVersion()

  const spell = useDataDragon.getSpell(spellId)

  const description = spell.name
  const uri = `https://ddragon.leagueoflegends.com/cdn/${usePatch.version}/img/spell/${spell.image.full}`

  return (
    <List.Item
      title={'Segunda Magia'}
      description={description}
      right={() => <Avatar.Image source={{ uri }} size={48} />}
    />
  )
}