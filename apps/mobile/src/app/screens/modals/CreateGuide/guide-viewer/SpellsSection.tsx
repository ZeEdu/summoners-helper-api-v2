import { Avatar, List, Text } from "react-native-paper";

import React from "react";
import FadeInView from "../../../../../components/animated/FadeInView";
import useDataDragonContext from "../../../../../contexts/data-dragon/useDataDragonContext";
import useI18n from "../../../../../contexts/i18n/useI18n";
import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import { GuideSummonerSpellsDto } from "../forms/GuideSpellsForm";
import { SectionProps } from "./sections.types";

type SpellsSectionProps = SectionProps & { guideSummonerSpells: GuideSummonerSpellsDto }

export default function SpellsSection({
  guideSummonerSpells,
  hideTitle = false }: SpellsSectionProps
) {
  const i18n = useI18n()

  return (
    <FadeInView>
      <List.Section>
        {
          !hideTitle ? (
            <List.Subheader>
              <Text variant='headlineSmall'>
                {i18n.t('spellSection.header')}
              </Text>
            </List.Subheader>
          ) : undefined
        }
        <SpellItem spellId={guideSummonerSpells.firstSpell} title={i18n.t('spellSection.first')} />
        <SpellItem spellId={guideSummonerSpells.secondSpell} title={i18n.t('spellSection.second')} />
        <List.Item title={i18n.t('spellSection.description')} description={guideSummonerSpells.spellsDescription} />
      </List.Section>
    </FadeInView>
  )
}

function SpellItem({ spellId, title }: {
  spellId: string,
  title: string
}) {
  const useDataDragon = useDataDragonContext();
  const usePatch = usePatchVersion()

  const spell = useDataDragon.getSpell(spellId)

  const description = spell.name
  const uri = `https://ddragon.leagueoflegends.com/cdn/${usePatch.version}/img/spell/${spell.image.full}`

  return (
    <List.Item
      title={title}
      description={description}
      right={() => <Avatar.Image source={{ uri }} size={48} />}
    />
  )
}