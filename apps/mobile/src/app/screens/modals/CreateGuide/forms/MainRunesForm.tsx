import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import z from "zod";

import AppSelectController from "../../../../../components/forms/app-select-controller/AppSelectController";
import AppInputController from "../../../../../components/forms/AppInputController";
import FormFieldErrors from "../../../../../components/forms/FormFieldErrors";
import { useStepperContext } from "../../../../../components/stepper/context";
import StepperFooter, { buildCustomButtonProps } from "../../../../../components/stepper/StepperFooter";
import { RunesReforgedDataDragon } from "../../../../../dtos/runes-reforged.dto";
import { CreateGuideDto, createGuideSchema } from "../dto/create-guide-schema";

export const mainRuneSchema = createGuideSchema.pick({
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
  } = useForm<MainRuneDto>({ resolver })

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
    stepperContext.nextStep()
    mainFormContext.setValues(formValues)
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
    <View style={styles.container}>
      <View style={styles.content}>
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
      </View>
      <StepperFooter
        customNextButton={
          buildCustomButtonProps({
            onPress: handleSubmit(onSubmit)
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