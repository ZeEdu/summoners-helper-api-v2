import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Dimensions, StyleSheet } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';

import {
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
import GuideSummonerSpellsForm from './forms/GuideSpellsForm';
import { ItemSelectionProvider } from './forms/items-form/context/item-selection.provider';
import ItemsForm from './forms/items-form/ItemsForm';
import GuideMainRunesForm from './forms/MainRunesForm';
import GuideSecondaryRunesForm from './forms/SecondaryRunesForm';
import ThreatsForm from './forms/ThreatsForm';
import GuideViewer from './guide-viewer/GuideViewer';

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

  const onSubmit = async (value: CreateGuideFormDto) => {
    setShowSnack(false);
    setError('');
    setLoading(true);

    const guideId = route.params.guide?._id.toString()

    createRequest(value, guideId)
      .catch((err) => {
        setError('Salvamento falhou. Tente novamente.');
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
                  <GuideViewer handleConfirm={methods.handleSubmit(onSubmit)} />
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