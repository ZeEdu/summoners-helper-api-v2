import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { Button } from "react-native-paper";
import z from "zod";
import AppSelectController from "../../../../../components/forms/app-select-controller/AppSelectController";
import AppInputController from "../../../../../components/forms/AppInputController";
import FormFieldErrors from "../../../../../components/forms/FormFieldErrors";
import { useStepperContext } from "../../../../../components/stepper/context";
import StepperFooter from "../../../../../components/stepper/StepperFooter";
import { CreateGuideDto, createGuideSchemaShape, SLOT_BONUS, SLOT_BONUS_LABELS } from "../dto/create-guide-schema";

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

export const BonusSchema = createGuideSchemaShape.pick({
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
    mainFormContext.setValues(formValues)
    stepperContext.nextStep()
  }

  const CustomNextButton = () => {
    return (
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={{ flex: 1 }}
      >
        Próximo passo
      </Button>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
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

      <StepperFooter customNextButton={CustomNextButton} />
    </View>
  )
}