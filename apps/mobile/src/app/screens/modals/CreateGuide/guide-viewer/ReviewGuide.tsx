import { CreateGuideFormDto } from '@org/contracts';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';


import { Text } from 'react-native-paper';
import { StepperFooter } from '../../../../../components/stepper';
import { buildCustomButtonProps } from '../../../../../components/stepper/build-custom-button-props';
import useI18n from '../../../../../contexts/i18n/useI18n';
import { AbilitiesProgressionDto } from '../forms/AbilitiesProgressionForm';
import { BonusDto } from '../forms/BonusForm';
import { GuideIntroductionDto } from '../forms/GuideIntroductionForm';
import { GuideSummonerSpellsDto } from '../forms/GuideSpellsForm';
import { ItemsDto } from '../forms/items-form/ItemsForm';
import { MainRuneDto } from '../forms/MainRunesForm';
import { SecondaryRuneDto } from '../forms/SecondaryRunesForm';
import { ThreatsDto } from '../forms/ThreatsForm';
import AbilitiesProgressionContent from './abilities-progression-content/AbilitiesProgressionContent';
import BonusContent from './bonus-content/BonusContent';
import ExpandableCard from './expandable-card/ExpandableCard';
import HeroBanner from './hero-banner/HeroBanner';
import ItemsContent from './items-content/ItemsContent';
import RuneContent from './rune-content/RuneContent';
import SpellContent from './spell-content/SpellContent';
import ThreatsContent from './threats-content/ThreatsContent';

type GuideViewerProps = {
  handleConfirm?: () => void
}

export default function ReviewGuide({ handleConfirm }: GuideViewerProps) {
  const mainFormContext = useFormContext<CreateGuideFormDto>();
  const i18n = useI18n()

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
        <HeroBanner championId={guideIntroduction.champion} role={guideIntroduction.role} />
        <ExpandableCard
          title={i18n.t('viewGuide.titles.intro')}
          titleIcon="text-box-outline"
        >
          <Text
            variant="bodyMedium"
          >
            {guideIntroduction.introduction}
          </Text>
        </ExpandableCard>

        <ExpandableCard
          title={i18n.t('viewGuide.titles.spells')}
          titleIcon="creation"
        >
          <SpellContent
            spells={guideSummonerSpells}
          />
        </ExpandableCard>

        <ExpandableCard
          title={i18n.t('viewGuide.titles.runes')}
          titleIcon={'hexagram-outline'}
        >
          <RuneContent
            rune={mainRune}
          />
          <RuneContent
            rune={secondaryRune}
          />
        </ExpandableCard>

        <ExpandableCard
          title={i18n.t('viewGuide.titles.bonus')}
          titleIcon={'shield-cross'}
        >
          <BonusContent
            bonus={bonus}
          />
        </ExpandableCard>

        <ExpandableCard
          title={i18n.t('viewGuide.titles.items')}
          titleIcon={'shopping'}
        >
          <ItemsContent
            items={items}
          />
        </ExpandableCard>

        <ExpandableCard
          title={i18n.t('viewGuide.titles.progression')}
          titleIcon={'chart-timeline-variant'}
        >
          <AbilitiesProgressionContent
            abilitiesProgression={abilitiesProgression}
            championId={guideIntroduction.champion}
          />
        </ExpandableCard>

        <ExpandableCard
          title={i18n.t('viewGuide.titles.threats')}
          titleIcon={'alert-outline'}
        >
          <ThreatsContent
            threats={threats}
          />
        </ExpandableCard>
      </ScrollView>
      {
        handleConfirm ? (
          <StepperFooter
            customNextButton={buildCustomButtonProps({
              children: i18n.t('reviewGuide.save'),
              onPress: handleConfirm,
              t: i18n.t
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
