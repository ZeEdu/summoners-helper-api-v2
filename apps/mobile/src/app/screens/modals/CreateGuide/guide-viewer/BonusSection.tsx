import React from "react";
import { Avatar, List, Text } from "react-native-paper";

import { SLOT_BONUS_LABELS } from "@org/contracts";

import { BonusDto } from "../forms/BonusForm";
import { SectionProps } from "./sections.types";

type BonusSectionProps = SectionProps & { bonus: BonusDto }

export default function BonusSection({ bonus, hideTitle = false }: BonusSectionProps) {
  return (
    <List.Section>
      {
        !hideTitle ? (
          <List.Subheader>
            <Text variant='headlineSmall'>
              Bonus

            </Text>
          </List.Subheader>
        ) : undefined
      }

      <List.Item title={'Descrição'} description={bonus.bonusDescription} />
      <BonusItem bonus={bonus.bonusSlotOne} title={'Primeiro Bonus'} />
      <BonusItem bonus={bonus.bonusSlotTwo} title={'Segundo Bonus'} />
      <BonusItem bonus={bonus.bonusSlotThree} title={'Terceiro Bonus'} />
    </List.Section>
  )
}

function BonusItem({ bonus, title }: {
  bonus: string,
  title: string
}) {
  // @ts-ignore 
  const label = SLOT_BONUS_LABELS[bonus]
  const uri = `https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatMods${bonus}Icon.png`

  return (
    <List.Item
      title={title}
      description={label}
      right={() => <Avatar.Image style={{ backgroundColor: 'transparent' }} source={{ uri }} size={32} />}
    />
  )
}