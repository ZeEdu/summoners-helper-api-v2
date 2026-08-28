import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import z from 'zod';

import { CreateGuideFormDto, CreateGuideFormSchema } from '@org/contracts';

import AppSelectController from '../../../../../components/forms/app-select-controller/AppSelectController';
import AppInputController from '../../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../../components/forms/FormFieldErrors';
import { useStepperContext } from '../../../../../components/stepper/context';
import StepperFooter, {
  buildCustomButtonProps,
} from '../../../../../components/stepper/StepperFooter';
import useDataDragonContext from '../../../../../contexts/data-dragon/useDataDragonContext';

export const secondaryRuneSchema = CreateGuideFormSchema.pick({
  secondaryRune: true,
  secondarySlots: true,
  secondaryRuneDescription: true,
});

export type SecondaryRuneDto = z.infer<typeof secondaryRuneSchema>;

const resolver = zodResolver(secondaryRuneSchema);

export default function GuideSecondaryRunesForm() {
  const useDataDragon = useDataDragonContext();
  const mainFormContext = useFormContext<CreateGuideFormDto>();
  const stepperContext = useStepperContext();

  const defaultValues: SecondaryRuneDto = {
    secondaryRune: mainFormContext.getValues('secondaryRune'),
    secondarySlots: mainFormContext.getValues('secondarySlots'),
    secondaryRuneDescription: mainFormContext.getValues('secondaryRuneDescription'),
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValues,
  } = useForm<SecondaryRuneDto>({ resolver, defaultValues });

  const secondaryRune = useWatch<SecondaryRuneDto>({
    control,
    name: 'secondaryRune',
  });

  const runeSlots = useWatch<SecondaryRuneDto>({
    control,
    name: [
      'secondarySlots.first',
      'secondarySlots.second',
      'secondarySlots.third',
    ],
  });

  const runeList = useDataDragon.dataDragon?.runes || [];
  const runeMap = useDataDragon.dataDragonMaps?.runes || {};

  const buildSecondaryRunePathOptions = () => {
    return runeList
      .filter(
        (rune) =>
          rune.id.toString() !== mainFormContext.getValues('primaryRune'),
      )
      .map(({ id, name }) => ({ value: id.toString(), label: name }));
  };

  const buildSecondaryRuneSlotsOptions = (
    slot: 'first' | 'second' | 'third',
  ) => {
    const currentSecondaryRunes = getValues('secondaryRune');
    if (!currentSecondaryRunes) {
      return [];
    }

    const { slots } = runeMap[currentSecondaryRunes];
    const runes = [...slots[1].runes, ...slots[2].runes, ...slots[3].runes];

    return runes
      .filter((rune) => {
        const notFirstSecondarySlot =
          rune.id.toString() !== getValues('secondarySlots.first');
        const notSecondSecondarySlot =
          rune.id.toString() !== getValues('secondarySlots.second');
        const notThirdSecondarySlot =
          rune.id.toString() !== getValues('secondarySlots.third');

        if (slot === 'first') {
          return notSecondSecondarySlot && notThirdSecondarySlot;
        } else if (slot === 'second') {
          return notFirstSecondarySlot && notThirdSecondarySlot;
        } else {
          return notFirstSecondarySlot && notSecondSecondarySlot;
        }
      })
      .map(({ id, name }) => ({ value: id.toString(), label: name }));
  };

  const onSubmit = (formValues: SecondaryRuneDto) => {
    mainFormContext.setValues(formValues, { shouldValidate: true });
    stepperContext.nextStep();
  };

  useEffect(() => {
    if (secondaryRune === defaultValues.secondaryRune) {
      return
    }

    setValues({
      secondarySlots: {
        first: '',
        second: '',
        third: '',
      },
    });
  }, [secondaryRune]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppSelectController
          control={control}
          title={'Caminho Principal'}
          options={buildSecondaryRunePathOptions()}
          placeholder={'Selecione um caminho'}
          name={`secondaryRune`}
        />
        <FormFieldErrors fieldError={errors.secondaryRune} />
        {!!secondaryRune && (
          <>
            <AppSelectController
              control={control}
              title={'Primeira Runa'}
              options={runeSlots && buildSecondaryRuneSlotsOptions('first')}
              placeholder={'Selecione a primeira runa'}
              name={`secondarySlots.first`}
            />
            <FormFieldErrors fieldError={errors.secondarySlots?.first} />

            <AppSelectController
              control={control}
              title={'Segunda Runa'}
              options={runeSlots && buildSecondaryRuneSlotsOptions('second')}
              placeholder={'Selecione a segunda runa'}
              name={`secondarySlots.second`}
            />
            <FormFieldErrors fieldError={errors.secondarySlots?.second} />

            <AppSelectController
              control={control}
              title={'Terceira Runa'}
              options={runeSlots && buildSecondaryRuneSlotsOptions('third')}
              placeholder={'Selecione a terceira runa'}
              name={`secondarySlots.third`}
            />
            <FormFieldErrors fieldError={errors.secondarySlots?.third} />

            <AppInputController
              control={control}
              name={'secondaryRuneDescription'}
              inputOptions={{
                label: 'Descrição da runas',
                placeholder: 'Descrição da runas',
                multiline: true,
              }}
            />
            <FormFieldErrors fieldError={errors.secondaryRuneDescription} />
          </>
        )}
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