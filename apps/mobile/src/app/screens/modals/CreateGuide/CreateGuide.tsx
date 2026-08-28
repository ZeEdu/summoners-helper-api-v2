import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Dimensions, StyleSheet } from 'react-native';
import { Button, Portal, Snackbar } from 'react-native-paper';

import {
  AbilityOption,
  CreateGuideFormDto,
  CreateGuideFormSchema
} from '@org/contracts';
import { StyledView } from '@org/ui';

import { Stepper, StepperItem } from '../../../../components/stepper';
import { StepperProvider } from '../../../../components/stepper/context';
import { ApiService } from '../../../../services/api/api.service';
import { ModalStackParamList } from '../../../navigation/types';
import GuideAbilitiesProgressionForm from './forms/AbilitiesProgressionForm';
import BonusForm from './forms/BonusForm';
import GuideIntroductionForm from './forms/GuideIntroductionForm';
import GuideFormReview from './forms/GuideReview';
import GuideSummonerSpellsForm from './forms/GuideSpellsForm';
import { ItemSelectionProvider } from './forms/items-form/context/item-selection.provider';
import ItemsForm from './forms/items-form/ItemsForm';
import GuideMainRunesForm from './forms/MainRunesForm';
import GuideSecondaryRunesForm from './forms/SecondaryRunesForm';
import ThreatsForm from './forms/ThreatsForm';

type Props = NativeStackScreenProps<ModalStackParamList, 'CreateGuide'>;

const resolver = zodResolver(CreateGuideFormSchema);

const createRequest = (value: CreateGuideFormDto, guideId?: string,) => {
  if (guideId) {
    return ApiService.Guides.patch(guideId, value)
  }

  return ApiService.Guides.create(value)
}

export default function CreateGuide({ navigation, route }: Props) {
  const [showSnack, setShowSnack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultValues = route.params.guide ?? {}

  const methods = useForm<CreateGuideFormDto>({
    resolver,
    defaultValues
  });

  const goBack = () => {
    navigation.goBack();
  };

  const onSubmit = async (value: CreateGuideFormDto) => {
    setShowSnack(false);
    setError('');
    setLoading(true);

    const guideId = route.params.guide?._id.toString()

    console.log({ value });

    createRequest(value, guideId)
      .catch((err) => {
        console.log({ err });

        setError('Salvamento falhou. Tente novamente.');
      })
      .finally(() => {
        setLoading(false);
        setShowSnack(true);
      });
  };

  const setValuesOnForm = () => {
    methods.setValues(
      {
        "title": "Segundo",
        "introduction": "asdasd",
        "champion": "Aatrox",
        "role": "TOP_LANE",
        "bonusSlotOne": "ADAPTIVE",
        "bonusSlotTwo": "ADAPTIVE",
        "bonusSlotThree": "BASE_HEALTH",
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
      },
      { shouldValidate: true },
    );
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

  useEffect(() => {
    const disableButton = !methods.formState.isValid || loading;

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
            disabled={disableButton}
            onPress={methods.handleSubmit(onSubmit)}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </>
      ),
    });
  }, [navigation, methods.formState, loading]);

  const checkFormValues = () => {
    const currentValues = methods.getValues()
    console.log({ currentValues });
  }

  return (
    <>
      <StyledView style={{ ...style.container, height: height }}>
        {
          <FormProvider {...methods}>
            <StepperProvider>
              <Stepper>
                <StepperItem title="GuideIntroductionForm">
                  <GuideIntroductionForm />
                </StepperItem>
                <StepperItem title="GuideSummonerSpellsForm">
                  <GuideSummonerSpellsForm />
                </StepperItem>
                <StepperItem title="GuideMainRunesForm">
                  <GuideMainRunesForm secondaryRune={secondaryRune} />
                </StepperItem>
                <StepperItem title="GuideSecondaryRunesForm">
                  <GuideSecondaryRunesForm />
                </StepperItem>
                <StepperItem title="BonusForm">
                  <BonusForm />
                </StepperItem>
                <StepperItem title="ItemsForm">
                  <ItemSelectionProvider>
                    <ItemsForm />
                  </ItemSelectionProvider>
                </StepperItem>
                <StepperItem title="GuideAbilitiesProgressionForm">
                  <GuideAbilitiesProgressionForm champion={watchChampion} />
                </StepperItem>
                <StepperItem title="ThreatsForm">
                  <ThreatsForm />
                </StepperItem>
                <StepperItem title="Revisão">
                  <GuideFormReview />
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
            // goBack(); // Apenas quando tiver sucesso
          }}
          action={{
            label: 'Fechar',
            onPress: () => {
              setShowSnack(false);
            },
          }}
        >
          {error ? error : 'Salvo com sucesso!'}
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
  },
  fieldContainer: {
    display: 'flex',
    gap: 8,
  },
});