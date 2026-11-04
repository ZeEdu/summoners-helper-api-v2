import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Dimensions, StyleSheet } from 'react-native';
import { Button, Portal, Snackbar } from 'react-native-paper';

import {
  AbilityOption,
  CreateGuideFormDto,
  CreateGuideFormSchema,
  GuideDto
} from '@org/contracts';
import { StyledView } from '@org/ui';

import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Stepper, StepperItem } from '../../../../components/stepper';
import { StepperProvider } from '../../../../components/stepper/context';
import useI18n from '../../../../contexts/i18n/useI18n';
import { ApiService } from '../../../../services/api/api.service';
import GuideAbilitiesProgressionForm from './forms/AbilitiesProgressionForm';
import BonusForm from './forms/BonusForm';
import GuideIntroductionForm from './forms/GuideIntroductionForm';
import GuideSummonerSpellsForm from './forms/GuideSpellsForm';
import { ItemSelectionProvider } from './forms/items-form/context/item-selection.provider';
import ItemsForm from './forms/items-form/ItemsForm';
import GuideMainRunesForm from './forms/MainRunesForm';
import GuideSecondaryRunesForm from './forms/SecondaryRunesForm';
import ThreatsForm from './forms/ThreatsForm';
import ReviewGuide from './guide-viewer/ReviewGuide';

const resolver = zodResolver(CreateGuideFormSchema);

const createRequest = (value: CreateGuideFormDto, guideId?: string,) => {
  if (guideId) {
    return ApiService.Guides.patch(guideId, value)
  }

  return ApiService.Guides.create(value)
}

type Props = StaticScreenProps<{
  guide?: GuideDto
}>

export default function CreateGuide({ route }: Props) {
  const [showSnack, setShowSnack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation()
  const i18n = useI18n()

  const defaultValues = route.params.guide ?? {}

  const methods = useForm<CreateGuideFormDto>({
    resolver,
    defaultValues
  });

  const onSubmit = async (value: CreateGuideFormDto) => {
    if (loading) return

    setShowSnack(false);
    setError('');
    setLoading(true);

    const guideId = route.params.guide?.id

    createRequest(value, guideId)
      .catch(() => {
        setError(i18n.t('createGuide.error'));
      })
      .finally(() => {
        setLoading(false);
        setShowSnack(true);
      });
  };

  const watchChampion = useWatch({
    control: methods.control,
    name: 'champion',
  });

  const secondaryRune = useWatch({
    control: methods.control,
    name: 'secondaryRune',
  });

  const { height } = Dimensions.get('window');

  const setValuesOnForm = () => {
    methods.setValues(
      DEFAULT_VALUES,
      { shouldValidate: true },
    );
  };

  // TODO: Criar uma forma de diferenciar o ambiente em que está rodando o projeto
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <Button
            mode="contained"
            style={style.headerButton}
            onPress={setValuesOnForm}
          >
            Set values
          </Button>
          <Button
            mode="contained"
            style={style.headerButton}
            onPress={methods.handleSubmit(onSubmit)}
          >
            {loading ? i18n.t('createGuide.saveButton.loading') : i18n.t('createGuide.saveButton.text')}
          </Button>
        </>
      ),
    });
  }, [navigation, methods.formState, loading]);

  return (
    <>
      <StyledView style={{ ...style.container, height }}>
        {
          <FormProvider {...methods}>
            <StepperProvider>
              <Stepper>
                <StepperItem title={i18n.t('createGuide.steppers.intro')}>
                  <GuideIntroductionForm />
                </StepperItem>
                <StepperItem title={i18n.t('createGuide.steppers.spells')}>
                  <GuideSummonerSpellsForm />
                </StepperItem>
                <StepperItem title={i18n.t('createGuide.steppers.primaryRunes')}>
                  <GuideMainRunesForm secondaryRune={secondaryRune} />
                </StepperItem>
                <StepperItem title={i18n.t('createGuide.steppers.secondaryRunes')}>
                  <GuideSecondaryRunesForm />
                </StepperItem>
                <StepperItem title={i18n.t('createGuide.steppers.bonus')}>
                  <BonusForm />
                </StepperItem>
                <StepperItem title={i18n.t('createGuide.steppers.items')}>
                  <ItemSelectionProvider>
                    <ItemsForm />
                  </ItemSelectionProvider>
                </StepperItem>
                <StepperItem title={i18n.t('createGuide.steppers.progression')}>
                  <GuideAbilitiesProgressionForm champion={watchChampion} />
                </StepperItem>
                <StepperItem title={i18n.t('createGuide.steppers.threats')}>
                  <ThreatsForm />
                </StepperItem>
                <StepperItem title={i18n.t('createGuide.steppers.review')}>
                  <ReviewGuide handleConfirm={methods.handleSubmit(onSubmit)} />
                </StepperItem>
              </Stepper>
            </StepperProvider>
          </FormProvider>
        }
      </StyledView>
      <Portal>
        <Snackbar
          visible={showSnack}
          onDismiss={() => {
            setShowSnack(false);
            if (!error) {
              navigation.goBack();
            }
          }}
          action={{
            label: i18n.t('createGuide.snack.close'),
            onPress: () => {
              setShowSnack(false);
            },
          }}
        >
          {error || i18n.t('createGuide.snack.success')}
        </Snackbar>
      </Portal>
    </>
  );
}

export const style = StyleSheet.create({
  headerButton: {
    marginRight: 16,
  },
  container: {
    marginHorizontal: 16,
    flex: 1,
  }
});

const DEFAULT_VALUES = {
  "title": "Segundo",
  "introduction": "asdasd",
  "champion": "Aatrox",
  "role": "TOP_LANE",
  "bonusSlotOne": "HealthPlus",
  "bonusSlotTwo": "MovementSpeed",
  "bonusSlotThree": "HealthPlus",
  "bonusDescription": "asdasd",
  "primaryRune": "8100",
  "primarySlots": {
    "first": "8112",
    "second": "8126",
    "third": "8137",
    "fourth": "8105"
  },
  "primaryRuneDescription": "asdasdasd",
  "secondaryRune": "8300",
  "secondarySlots": {
    "first": "8304",
    "second": "8306",
    "third": "8321"
  },
  "secondaryRuneDescription": "asdasdasd",
  "firstSpell": "SummonerBarrier",
  "secondSpell": "SummonerBoost",
  "spellsDescription": "asdasda",
  "items": [
    {
      "rowName": "asdasdasdasd",
      "itemsList": [
        {
          "itemId": "1001"
        }
      ],
      "description": "adasdasd"
    }
  ],
  "itemsDescription": "asdasdasd",
  "abilitiesProgression": {
    "l1": AbilityOption.A,
    "l2": AbilityOption.A,
    "l3": AbilityOption.A,
    "l4": AbilityOption.A,
    "l5": AbilityOption.A,
    "l6": AbilityOption.A,
    "l7": AbilityOption.A,
    "l8": AbilityOption.A,
    "l9": AbilityOption.A,
    "l10": AbilityOption.A,
    "l11": AbilityOption.A,
    "l12": AbilityOption.A,
    "l13": AbilityOption.A,
    "l14": AbilityOption.A,
    "l15": AbilityOption.A,
    "l16": AbilityOption.A,
    "l17": AbilityOption.A,
    "l18": AbilityOption.A,
  },
  "abilitiesProgressionDescription": "asdasdas",
  "threatsDescription": "asdasdasd",
  "threats": [
    {
      "threat": "Akali",
      "description": "asdasdasd"
    }
  ]
}