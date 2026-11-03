import React from "react";
import { Avatar, List, Text } from "react-native-paper";

import FadeInView from "../../../../../components/animated/FadeInView";
import useI18n from "../../../../../contexts/i18n/useI18n";
import { BonusDto } from "../forms/BonusForm";
import { SectionProps } from "./sections.types";

type BonusSectionProps = SectionProps & { bonus: BonusDto }

export default function BonusSection({ bonus, hideTitle = false }: BonusSectionProps) {
  const i18n = useI18n()

  return (
    <FadeInView>
      <List.Section>
        {
          !hideTitle ? (
            <List.Subheader>
              <Text variant='headlineSmall'>
                {i18n.t('bonusSection.header')}
              </Text>
            </List.Subheader>
          ) : undefined
        }

        <List.Item title={i18n.t('bonusSection.description')} description={bonus.bonusDescription} />
        <BonusItem bonus={bonus.bonusSlotOne} title={i18n.t('bonusSection.first')} />
        <BonusItem bonus={bonus.bonusSlotTwo} title={i18n.t('bonusSection.second')} />
        <BonusItem bonus={bonus.bonusSlotThree} title={i18n.t('bonusSection.third')} />
      </List.Section>
    </FadeInView>
  )
}

function BonusItem({ bonus, title }: {
  bonus: string,
  title: string
}) {
  const i18n = useI18n()

  const label = i18n.t(`slotAltBonus.${bonus}`)
  const uri = `https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatMods${bonus}Icon.png`

  return (
    <List.Item
      title={title}
      description={label}
      right={() => <Avatar.Image style={{ backgroundColor: 'transparent' }} source={{ uri }} size={32} />}
    />
  )
}