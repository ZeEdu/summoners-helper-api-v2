import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import z from "zod";

import { CreateGuideDto, CreateGuideSchema, SLOT_BONUS, SLOT_BONUS_LABELS } from "@org/contracts";

import AppSelectController from "../../../../../components/forms/app-select-controller/AppSelectController";
import AppInputController from "../../../../../components/forms/AppInputController";
import FormFieldErrors from "../../../../../components/forms/FormFieldErrors";
import { useStepperContext } from "../../../../../components/stepper/context";
import StepperFooter, { buildCustomButtonProps } from "../../../../../components/stepper/StepperFooter";

const slotOne = [
  {
    value: SLOT_BONUS.ADAPTIVE,
    label: SLOT_BONUS_LABELS.ADAPTIVE,
  },
  {
    value: SLOT_BONUS.ATTACK_SPEED,
    label: SLOT_BONUS_LABELS.ATTACK_SPEED,
  },
  {
    value: SLOT_BONUS.HASTE,
    label: SLOT_BONUS_LABELS.HASTE,
  },
];

const slotTwo = [
  {
    value: SLOT_BONUS.ADAPTIVE,
    label: SLOT_BONUS_LABELS.ADAPTIVE,
  },
  {
    value: SLOT_BONUS.MOVEMENT_SPEED,
    label: SLOT_BONUS_LABELS.MOVEMENT_SPEED,
  },
  {
    value: SLOT_BONUS.BONUS_HEALTH,
    label: SLOT_BONUS_LABELS.BONUS_HEALTH,
  },
];

const slotThree = [
  {
    value: SLOT_BONUS.BASE_HEALTH,
    label: SLOT_BONUS_LABELS.BASE_HEALTH,
  },
  {
    value: SLOT_BONUS.TENACITY,
    label: SLOT_BONUS_LABELS.TENACITY,
  },
  {
    value: SLOT_BONUS.BONUS_HEALTH,
    label: SLOT_BONUS_LABELS.BONUS_HEALTH,
  },
];

export const BonusSchema = CreateGuideSchema.pick({
  bonusDescription: true,
  bonusSlotOne: true,
  bonusSlotTwo: true,
  bonusSlotThree: true
})

export type BonusDto = z.infer<typeof BonusSchema>

const resolver = zodResolver(BonusSchema)

export default function BonusForm() {
  const mainFormContext = useFormContext<CreateGuideDto>()
  const stepperContext = useStepperContext()

  const { control, formState: { errors }, handleSubmit } = useForm<BonusDto>({ resolver })

  const onSubmit = (formValues: BonusDto) => {
    mainFormContext.setValues(formValues, { shouldValidate: true })
    stepperContext.nextStep()
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppInputController
          control={control}
          name={'bonusDescription'}
          inputOptions={{
            label: 'Descrição dos bonus',
            placeholder: 'Descreva os bonus',
            multiline: true
          }}
        />
        <FormFieldErrors fieldError={errors.bonusDescription} />

        <AppSelectController
          control={control}
          title={'Selecione um bonus'}
          options={slotOne}
          placeholder={'Selecione um bonus'}
          name={'bonusSlotOne'}
        />
        <FormFieldErrors fieldError={errors.bonusSlotOne} />

        <AppSelectController
          control={control}
          title={'Selecione um segundo bonus'}
          options={slotTwo}
          placeholder={'Selecione um segundo bonus'}
          name={'bonusSlotTwo'}
        />
        <FormFieldErrors fieldError={errors.bonusSlotTwo} />

        <AppSelectController
          control={control}
          title={'Selecione um terceiro bonus'}
          options={slotThree}
          placeholder={'Selecione um terceiro bonus'}
          name={'bonusSlotThree'}
        />
        <FormFieldErrors fieldError={errors.bonusSlotThree} />
      </View>

      <StepperFooter
        customNextButton={
          buildCustomButtonProps({
            onPress: handleSubmit(onSubmit),
          })}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1
  }
})