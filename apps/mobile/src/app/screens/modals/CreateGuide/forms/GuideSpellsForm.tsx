import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import z from 'zod';

import { CreateGuideFormDto, CreateGuideFormSchema } from '@org/contracts';

import AppSelectController from '../../../../../components/forms/app-select-controller/AppSelectController';
import AppInputController from '../../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../../components/forms/FormFieldErrors';
import { buildCustomButtonProps } from '../../../../../components/stepper/build-custom-button-props';
import { useStepperContext } from '../../../../../components/stepper/context';
import StepperFooter from '../../../../../components/stepper/StepperFooter';
import useDataDragonContext from '../../../../../contexts/data-dragon/useDataDragonContext';
import useI18n from '../../../../../contexts/i18n/useI18n';

const GuideSummonerSpellsSchema = CreateGuideFormSchema.pick({
  firstSpell: true,
  secondSpell: true,
  spellsDescription: true,
}).superRefine(({ firstSpell, secondSpell }, ctx) => {
  if (firstSpell === secondSpell) {
    ctx.addIssue({
      code: 'custom',
      message: 'Você não pode selecionar a mesma magia',
      path: ['secondSpell'],
    });
  }
});

export type GuideSummonerSpellsDto = z.infer<typeof GuideSummonerSpellsSchema>;

const resolver = zodResolver(GuideSummonerSpellsSchema);

export default function GuideSummonerSpellsForm() {
  const i18n = useI18n()

  const dataDragon = useDataDragonContext();
  const spellsList = dataDragon.lists?.spells || [];

  const mainFormContext = useFormContext<CreateGuideFormDto>();
  const stepperContext = useStepperContext();

  const defaultValues: GuideSummonerSpellsDto = {
    firstSpell: mainFormContext.getValues('firstSpell'),
    secondSpell: mainFormContext.getValues('secondSpell'),
    spellsDescription: mainFormContext.getValues('spellsDescription'),
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<GuideSummonerSpellsDto>({ resolver, defaultValues });

  const onSubmit = (formValues: GuideSummonerSpellsDto) => {
    mainFormContext.setValues(formValues, { shouldValidate: true });
    stepperContext.nextStep();
  };

  const watchSpells = useWatch({
    control,
    name: ['firstSpell', 'secondSpell'],
  });

  const buildFirstSpellOptions = () => {
    const secondSpellValue = getValues('secondSpell');

    return spellsList
      .filter(({ id }) => secondSpellValue !== id)
      .map(({ id, name }) => ({ value: id, label: name }));
  };

  const buildSecondSpellOptions = () => {
    const firstSpellValue = getValues('firstSpell');

    return spellsList
      .filter(({ id }) => firstSpellValue !== id)
      .map(({ id, name }) => ({ value: id, label: name }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {watchSpells && (
          <>
            <AppSelectController
              control={control}
              title={i18n.t('spellsForm.firstSpell.title')}
              options={buildFirstSpellOptions()}
              placeholder={i18n.t('spellsForm.firstSpell.placeholder')}
              name={'firstSpell'}
            />
            <FormFieldErrors fieldError={errors.firstSpell} />

            <AppSelectController
              control={control}
              title={i18n.t('spellsForm.secondSpell.title')}
              options={buildSecondSpellOptions()}
              placeholder={i18n.t('spellsForm.secondSpell.title')}
              name={'secondSpell'}
            />
            <FormFieldErrors fieldError={errors.secondSpell} />
          </>
        )}

        <AppInputController
          control={control}
          name={'spellsDescription'}
          inputOptions={{
            label: i18n.t('spellsForm.description.label'),
            placeholder: i18n.t('spellsForm.description.placeholder'),
            multiline: true,
          }}
        />
        <FormFieldErrors fieldError={errors.spellsDescription} />
      </View>

      <StepperFooter
        customNextButton={buildCustomButtonProps({
          onPress: handleSubmit(onSubmit),
          t: i18n.t
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