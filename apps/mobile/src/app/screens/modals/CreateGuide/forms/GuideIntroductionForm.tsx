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

import { useEffect } from 'react';
import { buildCustomButtonProps } from '../../../../../components/stepper/build-custom-button-props';
import { useStepperContext } from '../../../../../components/stepper/context';
import StepperFooter from '../../../../../components/stepper/StepperFooter';
import useDataDragonContext from '../../../../../contexts/data-dragon/useDataDragonContext';
import useI18n from '../../../../../contexts/i18n/useI18n';

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
  const i18n = useI18n()
  const dataDragon = useDataDragonContext();

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
    setValue
  } = useForm<GuideIntroductionDto>({ resolver, defaultValues });

  const onSubmit = (formValues: GuideIntroductionDto) => {
    // Setar o valor no formulário principal
    mainFormContext.setValues(formValues, { shouldValidate: true });
    // Ir para o próximo step
    stepperContext.nextStep();
  };

  const championList = dataDragon.lists.champions || [];

  const watchMainForm = mainFormContext.watch(['champion', 'introduction', 'role', 'title'])

  useEffect(() => {
    setValue('champion', 'Ahri')
    setValue('introduction', 'minha descricao')
    setValue('role', ROLES.MID_LANE)
    setValue('title', 'Titulo')
  }, [watchMainForm])

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppInputController
          control={control}
          name={'title'}
          inputOptions={{
            label: i18n.t('introForm.title.label'),
            placeholder: i18n.t('introForm.title.placeholder'),
          }}
        />
        <FormFieldErrors fieldError={errors.title} />

        <AppInputController
          control={control}
          name={'introduction'}
          inputOptions={{
            label: i18n.t('introForm.intro.label'),
            placeholder: i18n.t('introForm.intro.placeholder'),
            multiline: true,
          }}
        />
        <FormFieldErrors fieldError={errors.introduction} />

        <AppSelectController
          control={control}
          title={i18n.t('introForm.champion.title')}
          options={championList.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          placeholder={i18n.t('introForm.champion.placeholder')}
          name={'champion'}
        />
        <FormFieldErrors fieldError={errors.champion} />

        <AppSelectController
          control={control}
          title={i18n.t('introForm.role.title')}
          options={ROLE_OPTIONS}
          placeholder={i18n.t('introForm.role.placeholder')}
          name={'role'}
        />
        <FormFieldErrors fieldError={errors.role} />
      </View>
      <StepperFooter
        customNextButton={buildCustomButtonProps({
          onPress: handleSubmit(onSubmit),
          t: i18n.t,
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