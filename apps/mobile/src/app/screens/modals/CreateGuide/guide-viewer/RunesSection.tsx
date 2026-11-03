import { Avatar, List, Text } from "react-native-paper";

import FadeInView from "../../../../../components/animated/FadeInView";
import useDataDragonContext from "../../../../../contexts/data-dragon/useDataDragonContext";
import useI18n from "../../../../../contexts/i18n/useI18n";
import { MainRuneDto } from "../forms/MainRunesForm";
import { SecondaryRuneDto } from "../forms/SecondaryRunesForm";
import { SectionProps } from "./sections.types";

type RunesSectionProps = SectionProps & { mainRune: MainRuneDto, secondaryRune: SecondaryRuneDto }

export default function RunesSection({ mainRune, secondaryRune, hideTitle = false }: RunesSectionProps) {
  const i18n = useI18n()
  return (
    <FadeInView>
      <List.Section>
        {
          !hideTitle ? (
            <List.Subheader>
              <Text variant='headlineSmall'>
                {i18n.t('runesSection.header')}
              </Text>
            </List.Subheader>
          ) : undefined
        }

        <RuneItem title={i18n.t('runesSection.mainRune.title')} runeId={mainRune.primaryRune} />
        <RuneSlotItem title={i18n.t('runesSection.mainRune.description')} runeSlotId={mainRune.primarySlots.first} />
        <RuneSlotItem title={i18n.t('runesSection.mainRune.first')} runeSlotId={mainRune.primarySlots.second} />
        <RuneSlotItem title={i18n.t('runesSection.mainRune.second')} runeSlotId={mainRune.primarySlots.third} />
        <RuneSlotItem title={i18n.t('runesSection.mainRune.third')} runeSlotId={mainRune.primarySlots.fourth} />
        <List.Item title={'Descrição'} description={mainRune.primaryRuneDescription} />

        <RuneItem title={i18n.t('runesSection.secondaryRune.title')} runeId={secondaryRune.secondaryRune} />
        <RuneSlotItem title={i18n.t('runesSection.secondaryRune.description')} runeSlotId={secondaryRune.secondarySlots.first} />
        <RuneSlotItem title={i18n.t('runesSection.secondaryRune.first')} runeSlotId={secondaryRune.secondarySlots.second} />
        <RuneSlotItem title={i18n.t('runesSection.secondaryRune.second')} runeSlotId={secondaryRune.secondarySlots.third} />
        <List.Item title={i18n.t('runesSection.secondaryRune.third')} description={secondaryRune.secondaryRuneDescription} />
      </List.Section>
    </FadeInView>
  )
}

function RuneSlotItem({ runeSlotId, title }: {
  runeSlotId: string
  title: string
}) {
  const useDataDragon = useDataDragonContext();
  const runeSlot = useDataDragon.getRuneSlots(runeSlotId)

  const description = runeSlot.name
  const uri = `https://ddragon.leagueoflegends.com/cdn/img/${runeSlot.icon}`

  return (
    <List.Item
      title={title}
      description={description}
      right={() => <Avatar.Image style={{ backgroundColor: 'transparent' }} source={{ uri }} size={48} />}
    />
  )
}

function RuneItem({ runeId, title }: {
  runeId: string
  title: string
}) {
  const useDataDragon = useDataDragonContext();

  const rune = useDataDragon.getRune(runeId)

  const description = rune.name
  const uri = `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`

  return (
    <List.Item
      title={title}
      description={description}
      right={() => <Avatar.Image style={{ backgroundColor: 'transparent' }} source={{ uri }} size={48} />}
    />
  )
}