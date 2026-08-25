import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Dimensions, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import {
  AbilityOption,
  CreateGuideDto,
  CreateGuideSchema,
} from '@org/contracts';
import { StyledView } from '@org/ui';

import { Stepper, StepperItem } from '../../../../components/stepper';
import { StepperProvider } from '../../../../components/stepper/context';
import { ApiService } from '../../../../services/api/api.service';
import { ModalStackParamList } from '../../../navigation/types';
import GuideAbilitiesProgressionForm from './forms/AbilitiesProgressionForm';
import BonusForm from './forms/BonusForm';
import GuideIntroductionForm from './forms/GuideIntroductionForm';
import GuideSummonerSpellsForm from './forms/GuideSpellsForm';
import { ItemSelectionProvider } from './forms/items-form/context/item-selection.provider';
import ItemsForm from './forms/items-form/ItemsForm';
import GuideMainRunesForm from './forms/MainRunesForm';
import GuideSecondaryRunesForm from './forms/SecondaryRunesForm';
import ThreatsForm from './forms/ThreatsForm';

type Props = NativeStackScreenProps<ModalStackParamList, 'CreateGuide'>;

const resolver = zodResolver(CreateGuideSchema);

export default function CreateGuide({ navigation }: Props) {
  const methods = useForm<CreateGuideDto>({
    resolver,
  });

  const onSubmit = async (value: CreateGuideDto) => {
    ApiService.Guides.create(value)
      .then((response) => {
        console.log({ response });
      })
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => {
        console.log('finally');
      });

    console.log({ value });
  };

  const setValuesOnForm = () => {
    methods.setValues(
      {
        title: 'asdasd',
        introduction: 'asdasd',
        champion: 'Aatrox',
        role: 'MID_LANE',
        bonusSlotOne: 'ADAPTIVE',
        bonusSlotTwo: 'ADAPTIVE',
        bonusSlotThree: 'BASE_HEALTH',
        bonusDescription: 'asdasd',
        primaryRune: '8100',
        primarySlots: {
          first: '8112',
          second: '8126',
          third: '8137',
          fourth: '8105',
        },
        primaryRuneDescription: 'asdasdasd',
        secondaryRune: '8300',
        secondarySlots: {
          first: '8304',
          second: '8306',
          third: '8321',
        },
        secondaryRuneDescription: 'asdasdasd',
        firstSpell: 'SummonerBarrier',
        secondSpell: 'SummonerBoost',
        spellsDescription: 'asdasda',
        items: [
          {
            rowName: 'asdasdasdasd',
            itemsList: ['1001'],
            description: 'adasdasd',
          },
        ],
        itemsDescription: 'asdasdasd',
        abilitiesProgression: {
          l1: AbilityOption.A,
          l2: AbilityOption.A,
          l3: AbilityOption.A,
          l4: AbilityOption.A,
          l5: AbilityOption.A,
          l6: AbilityOption.A,
          l7: AbilityOption.A,
          l8: AbilityOption.A,
          l9: AbilityOption.A,
          l10: AbilityOption.A,
          l11: AbilityOption.A,
          l12: AbilityOption.A,
          l13: AbilityOption.A,
          l14: AbilityOption.A,
          l15: AbilityOption.A,
          l16: AbilityOption.A,
          l17: AbilityOption.A,
          l18: AbilityOption.A,
        },
        abilitiesProgressionDescription: 'asdasdas',
        threatsDescription: 'asdasdasd',
        threats: [
          {
            threat: 'Akali',
            description: 'asdasdasd',
          },
        ],
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

  // Carregar todos os dados
  useEffect(() => {
    console.log('[navigation, methods.formState]');

    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
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
            disabled={!methods.formState.isValid}
            onPress={methods.handleSubmit(onSubmit)}
          >
            Salvar
          </Button>
        </>
      ),
    });
  }, [navigation, methods.formState]);

  return (
    <StyledView style={{ ...style.container, height: height }}>
      {
        <FormProvider {...methods}>
          <StepperProvider>
            <Stepper>
              <StepperItem title="Primeiro Step">
                <GuideIntroductionForm />
              </StepperItem>
              <StepperItem title="Segundo Step">
                <GuideSummonerSpellsForm />
              </StepperItem>
              <StepperItem title="Terceiro Step">
                <GuideMainRunesForm secondaryRune={secondaryRune} />
              </StepperItem>
              <StepperItem title="Quarto Step">
                <GuideSecondaryRunesForm />
              </StepperItem>
              <StepperItem title="Quinto Step">
                <BonusForm />
              </StepperItem>
              <StepperItem title="Sexto Step">
                <ItemSelectionProvider>
                  <ItemsForm />
                </ItemSelectionProvider>
              </StepperItem>
              <StepperItem title="Sétimo Step">
                <GuideAbilitiesProgressionForm champion={watchChampion} />
              </StepperItem>
              <StepperItem title="Oitavo Step">
                <ThreatsForm />
              </StepperItem>
            </Stepper>
          </StepperProvider>
        </FormProvider>
      }
    </StyledView>
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