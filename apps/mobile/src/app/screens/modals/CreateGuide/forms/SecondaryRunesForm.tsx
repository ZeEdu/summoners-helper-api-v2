import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
import useDataDragon from '../../../../../contexts/data-dragon/useDataDragonContext';
import useI18n from '../../../../../contexts/i18n/useI18n';

export const secondaryRuneSchema = CreateGuideFormSchema.pick({
  secondaryRune: true,
  secondarySlots: true,
  secondaryRuneDescription: true,
});

export type SecondaryRuneDto = z.infer<typeof secondaryRuneSchema>;

const resolver = zodResolver(secondaryRuneSchema);

export default function GuideSecondaryRunesForm() {
  const dataDragon = useDataDragon();
  const i18n = useI18n()

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

  const runeList = dataDragon.lists?.runes || [];
  const runeMap = dataDragon.maps?.runes || {};

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
          title={i18n.t('secondaryRuneForm.secondaryRune.title')}
          options={buildSecondaryRunePathOptions()}
          placeholder={i18n.t('secondaryRuneForm.secondaryRune.placeholder')}
          name={`secondaryRune`}
        />
        <FormFieldErrors fieldError={errors.secondaryRune} />
        {!!secondaryRune && (
          <>
            <AppSelectController
              control={control}
              title={i18n.t('secondaryRuneForm.first.title')}
              options={runeSlots && buildSecondaryRuneSlotsOptions('first')}
              placeholder={i18n.t('secondaryRuneForm.first.placeholder')}
              name={`secondarySlots.first`}
            />
            <FormFieldErrors fieldError={errors.secondarySlots?.first} />

            <AppSelectController
              control={control}
              title={i18n.t('secondaryRuneForm.second.title')}
              options={runeSlots && buildSecondaryRuneSlotsOptions('second')}
              placeholder={i18n.t('secondaryRuneForm.second.placeholder')}
              name={`secondarySlots.second`}
            />
            <FormFieldErrors fieldError={errors.secondarySlots?.second} />

            <AppSelectController
              control={control}
              title={i18n.t('secondaryRuneForm.third.title')}
              options={runeSlots && buildSecondaryRuneSlotsOptions('third')}
              placeholder={i18n.t('secondaryRuneForm.third.placeholder')}
              name={`secondarySlots.third`}
            />
            <FormFieldErrors fieldError={errors.secondarySlots?.third} />

            <AppInputController
              control={control}
              name={'secondaryRuneDescription'}
              inputOptions={{
                label: i18n.t('secondaryRuneForm.description.label'),
                placeholder: i18n.t('secondaryRuneForm.description.placeholder'),
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