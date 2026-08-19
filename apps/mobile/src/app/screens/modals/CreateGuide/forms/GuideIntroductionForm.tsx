import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFormContext, useFormState } from "react-hook-form"
import z from "zod"

import AppSelectController from "../../../../../components/forms/app-select-controller/AppSelectController"
import AppInputController from "../../../../../components/forms/AppInputController"
import FormFieldErrors from "../../../../../components/forms/FormFieldErrors"

import { useEffect } from "react"
import { View } from "react-native"
import { Button } from "react-native-paper"
import { useStepperContext } from "../../../../../components/stepper/context"
import StepperFooter from "../../../../../components/stepper/StepperFooter"
import { ChampionsDataDragonDetails } from "../../../../../dtos/champion.dto"
import { CreateGuideDto, createGuideSchemaShape } from "../dto/create-guide-schema"

enum ROLES {
  JUNGLE = 'JUNGLE',
  TOP_LANE = 'TOP_LANE',
  MID_LANE = 'MID_LANE',
  ADC = 'ADC',
  SUPPORT = 'SUPPORT'
}

enum ROLES_LABEL {
  JUNGLE = 'Jungle',
  TOP_LANE = 'Top Lane',
  MID_LANE = 'Mid Lane',
  ADC = 'ADC',
  SUPPORT = 'Support'
}

const ROLE_OPTIONS: { value: string, label: string }[] = [
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
  }
]

const GuideIntroductionSchema = createGuideSchemaShape.pick({
  introduction: true,
  title: true,
  champion: true,
  role: true
})

export type GuideIntroductionDto = z.infer<typeof GuideIntroductionSchema>

const resolver = zodResolver(GuideIntroductionSchema)

type GuideIntroductionFormProp = {
  championList: ChampionsDataDragonDetails[],
}

export default function GuideIntroductionForm({ championList }: GuideIntroductionFormProp) {
  const mainFormContext = useFormContext<CreateGuideDto>()
  const stepperContext = useStepperContext()

  const {
    control,
    handleSubmit,
    formState: { errors }, getValues
  } = useForm<GuideIntroductionDto>({
    resolver,
    defaultValues: {
      introduction: '',
      title: '',
      champion: '',
      role: '',
    }
  })
  const { isValid } = useFormState({ control })

  useEffect(() => {

  }, [isValid]);

  const onSubmit = (formValues: GuideIntroductionDto) => {
    // Setar o valor no formulário principal
    mainFormContext.setValues(formValues)
    // Ir para o próximo step
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
          name={"title"}
          inputOptions={{
            label: 'Titulo',
            placeholder: 'Titulo'
          }}
        />
        <FormFieldErrors fieldError={errors.title} />

        <AppInputController
          control={control}
          name={"introduction"}
          inputOptions={{
            label: 'Introdução',
            placeholder: 'Introdução',
            multiline: true
          }}
        />
        <FormFieldErrors fieldError={errors.introduction} />

        <AppSelectController
          control={control}
          title={'Selecione um campeão'}
          options={championList.map(({ id, name }) => ({ value: id, label: name }))}
          placeholder={'Selecione um campeão'}
          name={'champion'}
        />
        <FormFieldErrors fieldError={errors.champion} />

        <AppSelectController
          control={control}
          title={'Selecione um role'}
          options={ROLE_OPTIONS}
          placeholder={'Selecione um role'}
          name={'role'}
        />
        <FormFieldErrors fieldError={errors.role} />
      </View>
      <Button onPress={() => {
        const champion = getValues().champion
        console.log({ champion });
      }}>
        Pegar valor
      </Button>

      <StepperFooter customNextButton={CustomNextButton} />
    </View>
  )
}