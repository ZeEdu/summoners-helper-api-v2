import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import z from 'zod';

import { CreateGuideDto, CreateGuideSchema } from '@org/contracts';

import AppSelectController from '../../../../../components/forms/app-select-controller/AppSelectController';
import AppInputController from '../../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../../components/forms/FormFieldErrors';
import { useStepperContext } from '../../../../../components/stepper/context';
import StepperFooter, {
  buildCustomButtonProps,
} from '../../../../../components/stepper/StepperFooter';
import useDataDragonContext from '../../../../../contexts/data-dragon/useDataDragonContext';

const GuideSummonerSpellsSchema = CreateGuideSchema.pick({
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
  const useDataDragon = useDataDragonContext();
  const spellsList = useDataDragon.dataDragon?.spells || [];

  const mainFormContext = useFormContext<CreateGuideDto>();
  const stepperContext = useStepperContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<GuideSummonerSpellsDto>({ resolver });

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
              title={'Selecione uma magia'}
              options={buildFirstSpellOptions()}
              placeholder={'Selecione uma magia'}
              name={'firstSpell'}
            />
            <FormFieldErrors fieldError={errors.firstSpell} />

            <AppSelectController
              control={control}
              title={'Selecione uma segunda magia'}
              options={buildSecondSpellOptions()}
              placeholder={'Selecione uma segunda magia'}
              name={'secondSpell'}
            />
            <FormFieldErrors fieldError={errors.secondSpell} />
          </>
        )}

        <AppInputController
          control={control}
          name={'spellsDescription'}
          inputOptions={{
            label: 'Descrição das magias',
            placeholder: 'Descreva o uso das magias',
            multiline: true,
          }}
        />
        <FormFieldErrors fieldError={errors.spellsDescription} />
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