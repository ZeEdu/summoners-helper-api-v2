import { Avatar, List, Text } from "react-native-paper";

import FadeInView from "../../../../../components/animated/FadeInView";
import useDataDragonContext from "../../../../../contexts/data-dragon/useDataDragonContext";
import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import { GuideSummonerSpellsDto } from "../forms/GuideSpellsForm";
import { SectionProps } from "./sections.types";

type SpellsSectionProps = SectionProps & { guideSummonerSpells: GuideSummonerSpellsDto }

export default function SpellsSection({
  guideSummonerSpells,
  hideTitle = false }: SpellsSectionProps
) {
  return (
    <FadeInView>
      <List.Section>
        {
          !hideTitle ? (
            <List.Subheader>
              <Text variant='headlineSmall'>
                Magias
              </Text>
            </List.Subheader>
          ) : undefined
        }
        <SpellItem spellId={guideSummonerSpells.firstSpell} />
        <SpellItem spellId={guideSummonerSpells.secondSpell} />
        <List.Item title={'Descrição'} description={guideSummonerSpells.spellsDescription} />
      </List.Section>
    </FadeInView>

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