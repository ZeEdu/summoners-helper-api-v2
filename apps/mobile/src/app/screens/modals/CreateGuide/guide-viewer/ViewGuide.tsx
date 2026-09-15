


import { StyledView } from "@org/ui";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { List } from "react-native-paper";
import { AbilitiesProgressionDto } from "../forms/AbilitiesProgressionForm";
import { BonusDto } from "../forms/BonusForm";
import { GuideIntroductionDto } from "../forms/GuideIntroductionForm";
import { GuideSummonerSpellsDto } from "../forms/GuideSpellsForm";
import { ItemsDto } from "../forms/items-form/ItemsForm";
import { MainRuneDto } from "../forms/MainRunesForm";
import { SecondaryRuneDto } from "../forms/SecondaryRunesForm";
import { ThreatsDto } from "../forms/ThreatsForm";
import AbilitiesProgressionSection from "./AbilitiesProgressionSection";
import BonusSection from "./BonusSection";
import IntroductionSection from "./IntroductionSection";
import ItemsSection from "./ItemsSection";
import RunesSection from "./RunesSection";
import SpellsSection from "./SpellsSection";
import ThreatsSection from "./ThreatsSection";

import { IGuide } from "@org/contracts";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";

type Props = StaticScreenProps<{
  guide: IGuide
}>

export default function ViewGuide({ route }: Props) {
  const { guide } = route.params

  const [visible, setVisible] = useState(true)
  const navigation = useNavigation()

  const guideIntroduction: GuideIntroductionDto = {
    title: guide.title,
    introduction: guide.introduction,
    champion: guide.champion,
    role: guide.role,
  }

  const guideSummonerSpells: GuideSummonerSpellsDto = {
    firstSpell: guide.firstSpell,
    secondSpell: guide.secondSpell,
    spellsDescription: guide.spellsDescription,
  }

  const mainRune: MainRuneDto = {
    primaryRune: guide.primaryRune,
    primarySlots: {
      ...guide.primarySlots,
      fourth: guide.primarySlots.fourth!
    },
    primaryRuneDescription: guide.primaryRuneDescription,
  }

  const secondaryRune: SecondaryRuneDto = {
    secondaryRune: guide.secondaryRune,
    secondarySlots: guide.secondarySlots,
    secondaryRuneDescription: guide.secondaryRuneDescription,
  }

  const bonus: BonusDto = {
    bonusDescription: guide.bonusDescription,
    bonusSlotOne: guide.bonusSlotOne,
    bonusSlotTwo: guide.bonusSlotTwo,
    bonusSlotThree: guide.bonusSlotThree,
  }

  const items: ItemsDto = {
    items: guide.items,
    itemsDescription: guide.itemsDescription,
  }

  const abilitiesProgression: AbilitiesProgressionDto = {
    abilitiesProgression: guide.abilitiesProgression,
    abilitiesProgressionDescription: guide.abilitiesProgressionDescription,
  }

  const threats: ThreatsDto = {
    threats: guide.threats,
    threatsDescription: guide.threatsDescription,
  }

  const { height } = Dimensions.get('window');

  useEffect(() => {
    navigation.setOptions({
      title: guideIntroduction.title
    });
  }, [navigation]);

  return (
    <StyledView style={{ height, flex: 1 }}>
      <ScrollView>
        <List.Accordion
          title={'Introdução'}
          id={'1'}
          expanded={visible}
          onPress={() => {
            setVisible((oldValue) => !oldValue)
          }}>
          <IntroductionSection hideTitle={true} guideIntroduction={guideIntroduction} />
        </List.Accordion>
        <List.Accordion title={'Magias'} id={'2'}>
          <SpellsSection guideSummonerSpells={guideSummonerSpells} hideTitle={true} />
        </List.Accordion>
        <List.Accordion title={'Runas'} id={'3'}>
          <RunesSection mainRune={mainRune} secondaryRune={secondaryRune} hideTitle={true} />
        </List.Accordion>
        <List.Accordion title={'Bonus'} id={'4'}>
          <BonusSection bonus={bonus} hideTitle={true} />
        </List.Accordion>
        <List.Accordion title={'Items'} id={'5'}>
          <ItemsSection items={items} hideTitle={true} />
        </List.Accordion>
        <List.Accordion title={'Progressão de abilidades'} id={'6'}>
          <AbilitiesProgressionSection abilitiesProgression={abilitiesProgression} champion={guideIntroduction.champion} hideTitle={true} />
        </List.Accordion>
        <List.Accordion title={'Ameaças'} id={'7'}>
          <ThreatsSection threats={threats} hideTitle={true} />
        </List.Accordion>
      </ScrollView>
    </StyledView>
  )
} 