import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { View } from "react-native";
import { Button } from "react-native-paper";
import z from "zod";
import AppSelectController from "../../../../../components/forms/app-select-controller/AppSelectController";
import AppInputController from "../../../../../components/forms/AppInputController";
import FormFieldErrors from "../../../../../components/forms/FormFieldErrors";
import { useStepperContext } from "../../../../../components/stepper/Stepper";
import StepperFooter from "../../../../../components/stepper/StepperFooter";
import { SummonerSpell } from "../../../../../dtos/spell.dto";
import { CreateGuideDto, createGuideSchemaShape } from "../dto/create-guide-schema";

const GuideSummonerSpellsSchema = createGuideSchemaShape.pick({
  firstSpell: true,
  secondSpell: true,
  spellsDescription: true
})
  .superRefine(({ firstSpell, secondSpell }, ctx) => {
    if (firstSpell === secondSpell) {
      ctx.addIssue({
        code: 'custom',
        message: 'Você não pode selecionar a mesma magia',
        path: ['secondSpell']
      })
    }
  })

export type GuideSummonerSpellsDto = z.infer<typeof GuideSummonerSpellsSchema>

const resolver = zodResolver(GuideSummonerSpellsSchema)

type GuideIntroductionFormProp = {
  summonerSpells: SummonerSpell[]
}

export default function GuideSummonerSpellsForm({ summonerSpells }: GuideIntroductionFormProp) {
  const mainFormContext = useFormContext<CreateGuideDto>()

  const stepperContext = useStepperContext()

  const { control, handleSubmit, formState: { errors }, getValues } = useForm<GuideSummonerSpellsDto>({ resolver })

  const onSubmit = (formValues: GuideSummonerSpellsDto) => {
    mainFormContext.setValues(formValues)
    stepperContext.nextStep()
  }

  const watchSpells = useWatch({
    control,
    name: ['firstSpell', 'secondSpell']
  })

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

  const buildFirstSpellOptions = () => {
    const secondSpellValue = getValues('secondSpell')

    return summonerSpells
      .filter(({ id }) => secondSpellValue !== id)
      .map(({ id, name }) => ({ value: id, label: name }))
  }

  const buildSecondSpellOptions = () => {
    const firstSpellValue = getValues('firstSpell')

    return summonerSpells
      .filter(({ id }) => firstSpellValue !== id)
      .map(({ id, name }) => ({ value: id, label: name }))
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
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
          </>)
        }

        <AppInputController
          control={control}
          name={"spellsDescription"}
          inputOptions={{
            label: 'Descrição das magias',
            placeholder: 'Descreva o uso das magias',
            multiline: true
          }}
        />
        <FormFieldErrors fieldError={errors.spellsDescription} />
      </View>

      <StepperFooter customNextButton={CustomNextButton} />
    </View>
  )
}