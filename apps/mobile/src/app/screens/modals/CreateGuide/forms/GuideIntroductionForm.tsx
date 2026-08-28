import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import z from 'zod';

import {
  CreateGuideFormDto,
  CreateGuideFormSchema,
  ROLES,
  ROLES_LABEL,
} from '@org/contracts';

import AppSelectController from '../../../../../components/forms/app-select-controller/AppSelectController';
import AppInputController from '../../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../../components/forms/FormFieldErrors';

import { useStepperContext } from '../../../../../components/stepper/context';
import StepperFooter, {
  buildCustomButtonProps,
} from '../../../../../components/stepper/StepperFooter';
import useDataDragonContext from '../../../../../contexts/data-dragon/useDataDragonContext';

const ROLE_OPTIONS: { value: string; label: string }[] = [
  {
    value: ROLES.JUNGLE,
    label: ROLES_LABEL.JUNGLE,
  },
  {
    value: ROLES.TOP_LANE,
    label: ROLES_LABEL.TOP_LANE,
  },
  {
    value: ROLES.MID_LANE,
    label: ROLES_LABEL.MID_LANE,
  },
  {
    value: ROLES.ADC,
    label: ROLES_LABEL.ADC,
  },
  {
    value: ROLES.SUPPORT,
    label: ROLES_LABEL.SUPPORT,
  },
];

const GuideIntroductionSchema = CreateGuideFormSchema.pick({
  introduction: true,
  title: true,
  champion: true,
  role: true,
});

export type GuideIntroductionDto = z.infer<typeof GuideIntroductionSchema>;

const resolver = zodResolver(GuideIntroductionSchema);

export default function GuideIntroductionForm() {
  const useDataDragon = useDataDragonContext();

  const mainFormContext = useFormContext<CreateGuideFormDto>();
  const stepperContext = useStepperContext();

  const defaultValues: GuideIntroductionDto = {
    title: mainFormContext.getValues('title'),
    introduction: mainFormContext.getValues('introduction'),
    champion: mainFormContext.getValues('champion'),
    role: mainFormContext.getValues('role'),
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GuideIntroductionDto>({ resolver, defaultValues });

  const onSubmit = (formValues: GuideIntroductionDto) => {
    // Setar o valor no formulário principal
    mainFormContext.setValues(formValues, { shouldValidate: true });
    // Ir para o próximo step
    stepperContext.nextStep();
  };

  const championList = useDataDragon.dataDragon?.champions || [];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppInputController
          control={control}
          name={'title'}
          inputOptions={{
            label: 'Titulo',
            placeholder: 'Titulo',
          }}
        />
        <FormFieldErrors fieldError={errors.title} />

        <AppInputController
          control={control}
          name={'introduction'}
          inputOptions={{
            label: 'Introdução',
            placeholder: 'Introdução',
            multiline: true,
          }}
        />
        <FormFieldErrors fieldError={errors.introduction} />

        <AppSelectController
          control={control}
          title={'Selecione um campeão'}
          options={championList.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          placeholder={'Selecione um campeão'}
          name={'champion'}
        />
        <FormFieldErrors fieldError={errors.champion} />

        <AppSelectController
          control={control}
          title={'Selecione um role'}
          options={ROLE_OPTIONS}
          placeholder={'Selecione um role'}
          name={'role'}
        />
        <FormFieldErrors fieldError={errors.role} />
      </View>
      <StepperFooter
        customNextButton={buildCustomButtonProps({
          onPress: handleSubmit(onSubmit),
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});