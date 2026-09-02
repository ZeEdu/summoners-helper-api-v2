import { CreateGuideFormDto } from '@org/contracts';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';

import AbilitiesProgressionSection from './AbilitiesProgressionSection';
import BonusSection from './BonusSection';
import IntroductionSection from './IntroductionSection';
import ItemsSection from './ItemsSection';
import RunesSection from './RunesSection';
import SpellsSection from './SpellsSection';
import ThreatsSection from './ThreatsSection';

import { StepperFooter } from '../../../../../components/stepper';
import { buildCustomButtonProps } from '../../../../../components/stepper/StepperFooter';
import { AbilitiesProgressionDto } from '../forms/AbilitiesProgressionForm';
import { BonusDto } from '../forms/BonusForm';
import { GuideIntroductionDto } from '../forms/GuideIntroductionForm';
import { GuideSummonerSpellsDto } from '../forms/GuideSpellsForm';
import { ItemsDto } from '../forms/items-form/ItemsForm';
import { MainRuneDto } from '../forms/MainRunesForm';
import { SecondaryRuneDto } from '../forms/SecondaryRunesForm';
import { ThreatsDto } from '../forms/ThreatsForm';

type GuideViewerProps = {
  handleConfirm?: () => void
}

export default function GuideViewer({ handleConfirm }: GuideViewerProps) {
  const mainFormContext = useFormContext<CreateGuideFormDto>();

  const guideIntroduction: GuideIntroductionDto = {
    title: mainFormContext.getValues('title'),
    introduction: mainFormContext.getValues('introduction'),
    champion: mainFormContext.getValues('champion'),
    role: mainFormContext.getValues('role'),
  }

  const guideSummonerSpells: GuideSummonerSpellsDto = {
    firstSpell: mainFormContext.getValues('firstSpell'),
    secondSpell: mainFormContext.getValues('secondSpell'),
    spellsDescription: mainFormContext.getValues('spellsDescription'),
  }

  const mainRune: MainRuneDto = {
    primaryRune: mainFormContext.getValues('primaryRune'),
    primarySlots: mainFormContext.getValues('primarySlots'),
    primaryRuneDescription: mainFormContext.getValues('primaryRuneDescription'),
  }

  const secondaryRune: SecondaryRuneDto = {
    secondaryRune: mainFormContext.getValues('secondaryRune'),
    secondarySlots: mainFormContext.getValues('secondarySlots'),
    secondaryRuneDescription: mainFormContext.getValues('secondaryRuneDescription'),
  }

  const bonus: BonusDto = {
    bonusDescription: mainFormContext.getValues('bonusDescription'),
    bonusSlotOne: mainFormContext.getValues('bonusSlotOne'),
    bonusSlotTwo: mainFormContext.getValues('bonusSlotTwo'),
    bonusSlotThree: mainFormContext.getValues('bonusSlotThree'),
  }

  const items: ItemsDto = {
    items: mainFormContext.getValues('items'),
    itemsDescription: mainFormContext.getValues('itemsDescription')
  }

  const abilitiesProgression: AbilitiesProgressionDto = {
    abilitiesProgression: mainFormContext.getValues('abilitiesProgression'),
    abilitiesProgressionDescription: mainFormContext.getValues('abilitiesProgressionDescription')
  }

  const threats: ThreatsDto = {
    threats: mainFormContext.getValues('threats'),
    threatsDescription: mainFormContext.getValues('threatsDescription'),
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <IntroductionSection guideIntroduction={guideIntroduction} />
        <SpellsSection guideSummonerSpells={guideSummonerSpells} />
        <RunesSection mainRune={mainRune} secondaryRune={secondaryRune} />
        <BonusSection bonus={bonus} />
        <ItemsSection items={items} />
        <AbilitiesProgressionSection abilitiesProgression={abilitiesProgression} champion={guideIntroduction.champion} />
        <ThreatsSection threats={threats} />
      </ScrollView>
      {
        handleConfirm ? (
          <StepperFooter
            customNextButton={buildCustomButtonProps({
              children: 'Salvar',
              onPress: handleConfirm,
            })}
          />
        ) : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
