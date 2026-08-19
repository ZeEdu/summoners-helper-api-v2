import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { View } from "react-native";
import { Button } from "react-native-paper";
import z from "zod";
import AppSelectController from "../../../../../components/forms/app-select-controller/AppSelectController";
import AppInputController from "../../../../../components/forms/AppInputController";
import FormFieldErrors from "../../../../../components/forms/FormFieldErrors";
import { useStepperContext } from "../../../../../components/stepper/Stepper";
import StepperFooter from "../../../../../components/stepper/StepperFooter";
import { RunesReforgedDataDragon } from "../../../../../dtos/runes-reforged.dto";
import { CreateGuideDto, createGuideSchemaShape } from "../dto/create-guide-schema";

export const mainRuneSchema = createGuideSchemaShape.pick({
  primaryRune: true,
  primarySlots: true,
  primaryRuneDescription: true
})

export type MainRuneDto = z.infer<typeof mainRuneSchema>

type Props = {
  runes: RunesReforgedDataDragon[],
  runesMap: Record<string, RunesReforgedDataDragon>,
  secondaryRune: string
}

const resolver = zodResolver(mainRuneSchema)

export default function GuideMainRunesForm({ runes, runesMap, secondaryRune }: Props) {
  const mainFormContext = useFormContext<CreateGuideDto>()

  const stepperContext = useStepperContext()

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValues
  } = useForm<MainRuneDto>({
    resolver, defaultValues: {
      primaryRune: "8100",
      primarySlots: {
        first: "8112",
        second: "8126",
        third: "8136",
        fourth: "8135"
      },
      primaryRuneDescription: "asddasdasd",
    }
  })

  const primaryRune = useWatch<MainRuneDto>({
    control,
    name: 'primaryRune'
  })

  const buildMainRunesOptions = () => {
    return runes
      .filter((rune) => rune.id.toString() !== secondaryRune)
      .map(({ id, name }) => ({ value: id.toString(), label: name }))
  }

  const buildFirstRunesOptions = (slot: 'first' | 'second' | 'third' | 'forth') => {
    const currentPrimaryRunes = getValues('primaryRune')
    if (!currentPrimaryRunes) {
      return []
    }

    let index: number
    if (slot === 'first') {
      index = 0
    } else if (slot === 'second') {
      index = 1
    } else if (slot === 'third') {
      index = 2
    } else {
      index = 3
    }

    const { slots } = runesMap[currentPrimaryRunes]
    return slots[index].runes
      .map(({ id, name }) => ({ value: id.toString(), label: name }))
  }

  const onSubmit = (formValues: MainRuneDto) => {
    mainFormContext.setValues(formValues)
    stepperContext.nextStep()
  }

  const CustomNextButton = () => {
    return (
      <Button
        mode="contained"
        style={{ flex: 1 }}
        onPress={handleSubmit(onSubmit)}
      >
        Próximo passo
      </Button>
    )
  }

  useEffect(() => {
    setValues({
      primarySlots: {
        first: '',
        second: '',
        third: '',
        fourth: '',
      }
    })
  }, [primaryRune])

  return (
    <View>
      <View>
        <AppSelectController
          control={control}
          title={'Caminho Principal'}
          options={buildMainRunesOptions()}
          placeholder={'Selecione um caminho'}
          name={`primaryRune`}
        />
        <FormFieldErrors fieldError={errors.primaryRune} />
        {
          (!!primaryRune) && (
            <>
              <AppSelectController
                control={control}
                title={'Primeira Runa'}
                options={buildFirstRunesOptions('first')}
                placeholder={'Selecione a primeira runa'}
                name={`primarySlots.first`}
              />
              <FormFieldErrors fieldError={errors.primarySlots?.first} />

              <AppSelectController
                control={control}
                title={'Segunda Runa'}
                options={buildFirstRunesOptions('second')}
                placeholder={'Selecione a segunda runa'}
                name={`primarySlots.second`}
              />
              <FormFieldErrors fieldError={errors.primarySlots?.second} />

              <AppSelectController
                control={control}
                title={'Terceira Runa'}
                options={buildFirstRunesOptions('third')}
                placeholder={'Selecione a terceira runa'}
                name={`primarySlots.third`}
              />
              <FormFieldErrors fieldError={errors.primarySlots?.third} />

              <AppSelectController
                control={control}
                title={'Quarta Runa'}
                options={buildFirstRunesOptions('forth')}
                placeholder={'Selecione a quarta runa'}
                name={`primarySlots.fourth`}
              />
              <FormFieldErrors fieldError={errors.primarySlots?.fourth} />

              <AppInputController
                control={control}
                name={'primaryRuneDescription'}
                inputOptions={{
                  label: 'Descrição da runas',
                  placeholder: 'Descrição da runas',
                  multiline: true
                }}
              />
              <FormFieldErrors fieldError={errors.primaryRuneDescription} />
            </>
          )
        }
        <Button onPress={() => {
          const values = getValues()
          console.log({ values });
        }}>Pegar valores do formulário</Button>
      </View>
      <StepperFooter customNextButton={CustomNextButton} />
    </View>
  )
}