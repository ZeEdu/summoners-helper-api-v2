import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import z from 'zod';

import { CreateGuideFormDto, CreateGuideFormSchema } from '@org/contracts';

import { useEffect } from 'react';
import AppSelectController from '../../../../../components/forms/app-select-controller/AppSelectController';
import AppInputController from '../../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../../components/forms/FormFieldErrors';
import { buildCustomButtonProps } from '../../../../../components/stepper/build-custom-button-props';
import { useStepperContext } from '../../../../../components/stepper/context';
import StepperFooter from '../../../../../components/stepper/StepperFooter';
import useDataDragon from '../../../../../contexts/data-dragon/useDataDragonContext';
import useI18n from '../../../../../contexts/i18n/useI18n';

export const mainRuneSchema = CreateGuideFormSchema.pick({
  primaryRune: true,
  primarySlots: true,
  primaryRuneDescription: true,
});

export type MainRuneDto = z.infer<typeof mainRuneSchema>;

const resolver = zodResolver(mainRuneSchema);

type Props = {
  secondaryRune: string;
};

export default function GuideMainRunesForm({ secondaryRune }: Props) {
  const dataDragon = useDataDragon();
  const i18n = useI18n()

  const mainFormContext = useFormContext<CreateGuideFormDto>();
  const stepperContext = useStepperContext();

  const defaultValues: MainRuneDto = {
    primaryRune: mainFormContext.getValues('primaryRune'),
    primarySlots: mainFormContext.getValues('primarySlots'),
    primaryRuneDescription: mainFormContext.getValues('primaryRuneDescription'),
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValues,
  } = useForm<MainRuneDto>({ resolver, defaultValues });

  const primaryRune = useWatch<MainRuneDto>({
    control,
    name: 'primaryRune',
  });

  const runeList = dataDragon.lists?.runes || [];
  const runeMap = dataDragon.maps?.runes || {};

  const buildMainRunesOptions = () => {
    return runeList
      .filter((rune) => rune.id.toString() !== secondaryRune)
      .map(({ id, name }) => ({ value: id.toString(), label: name }));
  };

  const buildFirstRunesOptions = (
    slot: 'first' | 'second' | 'third' | 'forth',
  ) => {
    const currentPrimaryRunes = getValues('primaryRune');
    if (!currentPrimaryRunes) {
      return [];
    }

    let index: number;
    if (slot === 'first') {
      index = 0;
    } else if (slot === 'second') {
      index = 1;
    } else if (slot === 'third') {
      index = 2;
    } else {
      index = 3;
    }

    const { slots } = runeMap[currentPrimaryRunes];
    return slots[index].runes.map(({ id, name }) => ({
      value: id.toString(),
      label: name,
    }));
  };

  const onSubmit = (formValues: MainRuneDto) => {
    mainFormContext.setValues(formValues, { shouldValidate: true });
    stepperContext.nextStep();
  };

  useEffect(() => {
    if (primaryRune === defaultValues.primaryRune) {
      return;
    }

    setValues({
      primarySlots: {
        first: '',
        second: '',
        third: '',
        fourth: '',
      },
    });
  }, [primaryRune]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppSelectController
          control={control}
          title={i18n.t('mainRuneForm.primaryRune.title')}
          options={buildMainRunesOptions()}
          placeholder={i18n.t('mainRuneForm.primaryRune.placeholder')}
          name={`primaryRune`}
        />
        <FormFieldErrors fieldError={errors.primaryRune} />
        {!!primaryRune && (
          <>
            <AppSelectController
              control={control}
              title={i18n.t('mainRuneForm.first.title')}
              options={buildFirstRunesOptions('first')}
              placeholder={i18n.t('mainRuneForm.first.placeholder')}
              name={`primarySlots.first`}
            />
            <FormFieldErrors fieldError={errors.primarySlots?.first} />

            <AppSelectController
              control={control}
              title={i18n.t('mainRuneForm.second.title')}
              options={buildFirstRunesOptions('second')}
              placeholder={i18n.t('mainRuneForm.second.placeholder')}
              name={`primarySlots.second`}
            />
            <FormFieldErrors fieldError={errors.primarySlots?.second} />

            <AppSelectController
              control={control}
              title={i18n.t('mainRuneForm.third.title')}
              options={buildFirstRunesOptions('third')}
              placeholder={i18n.t('mainRuneForm.third.placeholder')}
              name={`primarySlots.third`}
            />
            <FormFieldErrors fieldError={errors.primarySlots?.third} />

            <AppSelectController
              control={control}
              title={i18n.t('mainRuneForm.fourth.title')}
              options={buildFirstRunesOptions('forth')}
              placeholder={i18n.t('mainRuneForm.fourth.placeholder')}
              name={`primarySlots.fourth`}
            />
            <FormFieldErrors fieldError={errors.primarySlots?.fourth} />

            <AppInputController
              control={control}
              name={'primaryRuneDescription'}
              inputOptions={{
                label: i18n.t('mainRuneForm.description.label'),
                placeholder: i18n.t('mainRuneForm.description.placeholder'),
                multiline: true,
              }}
            />
            <FormFieldErrors fieldError={errors.primaryRuneDescription} />
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