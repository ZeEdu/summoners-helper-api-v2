import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import z from 'zod';

import {
  CreateGuideFormDto,
  CreateGuideFormSchema,
  SLOT_BONUS
} from '@org/contracts';

import AppSelectController from '../../../../../components/forms/app-select-controller/AppSelectController';
import AppInputController from '../../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../../components/forms/FormFieldErrors';
import { buildCustomButtonProps } from '../../../../../components/stepper/build-custom-button-props';
import { useStepperContext } from '../../../../../components/stepper/context';
import StepperFooter from '../../../../../components/stepper/StepperFooter';
import useI18n from '../../../../../contexts/i18n/useI18n';

const makeSlots = (slots: SLOT_BONUS[], t: (key: string) => string) => {
  return slots
    .map((key) => ({
      value: key,
      label: t(`slotAltBonus.${key}`)
    }))
}

const makeSlotOne = (t: (key: string) => string) => {
  return makeSlots([SLOT_BONUS.HEALTH, SLOT_BONUS.ATTACK_SPEED, SLOT_BONUS.HASTE], t)
}

const makeSlotTwo = (t: (key: string) => string) => {
  return makeSlots([SLOT_BONUS.ADAPTIVE_FORCE, SLOT_BONUS.MOVEMENT_SPEED, SLOT_BONUS.HEALTH], t)
}

const makeSlotThree = (t: (key: string) => string) => {
  return makeSlots([SLOT_BONUS.HEALTH, SLOT_BONUS.TENACITY, SLOT_BONUS.HEALTH_SCALING], t)
}

export const BonusSchema = CreateGuideFormSchema.pick({
  bonusDescription: true,
  bonusSlotOne: true,
  bonusSlotTwo: true,
  bonusSlotThree: true,
});

export type BonusDto = z.infer<typeof BonusSchema>;

const resolver = zodResolver(BonusSchema);

export default function BonusForm() {
  const mainFormContext = useFormContext<CreateGuideFormDto>();
  const stepperContext = useStepperContext();
  const i18n = useI18n()

  const defaultValues: BonusDto = {
    bonusSlotOne: mainFormContext.getValues('bonusSlotOne'),
    bonusSlotTwo: mainFormContext.getValues('bonusSlotTwo'),
    bonusSlotThree: mainFormContext.getValues('bonusSlotThree'),
    bonusDescription: mainFormContext.getValues('bonusDescription'),
  }

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<BonusDto>({ resolver, defaultValues });

  const onSubmit = (formValues: BonusDto) => {
    mainFormContext.setValues(formValues, { shouldValidate: true });
    stepperContext.nextStep();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppInputController
          control={control}
          name={'bonusDescription'}
          inputOptions={{
            label: i18n.t('bonusForm.description.label'),
            placeholder: i18n.t('bonusForm.description.placeholder'),
            multiline: true,
          }}
        />
        <FormFieldErrors fieldError={errors.bonusDescription} />

        <AppSelectController
          control={control}
          title={i18n.t('bonusForm.slotOne.title')}
          options={makeSlotOne(i18n.t)}
          placeholder={i18n.t('bonusForm.slotOne.placeholder')}
          name={'bonusSlotOne'}
        />
        <FormFieldErrors fieldError={errors.bonusSlotOne} />

        <AppSelectController
          control={control}
          title={i18n.t('bonusForm.slotTwo.title')}
          options={makeSlotTwo(i18n.t)}
          placeholder={i18n.t('bonusForm.slotTwo.placeholder')}
          name={'bonusSlotTwo'}
        />
        <FormFieldErrors fieldError={errors.bonusSlotTwo} />

        <AppSelectController
          control={control}
          title={i18n.t('bonusForm.slotThree.title')}
          options={makeSlotThree(i18n.t)}
          placeholder={i18n.t('bonusForm.slotThree.placeholder')}
          name={'bonusSlotThree'}
        />
        <FormFieldErrors fieldError={errors.bonusSlotThree} />
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