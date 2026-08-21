import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import z from "zod";

import { StyledButton } from "@org/ui";

import AppSelectController from "../../../../../components/forms/app-select-controller/AppSelectController";
import AppInputController from "../../../../../components/forms/AppInputController";
import FormFieldErrors from "../../../../../components/forms/FormFieldErrors";
import { StepperFooter } from "../../../../../components/stepper";
import { useStepperContext } from "../../../../../components/stepper/context";
import { buildCustomButtonProps } from "../../../../../components/stepper/StepperFooter";
import { ChampionsDataDragonDetails } from "../../../../../dtos/champion.dto";
import { style } from "../CreateGuide";
import { CreateGuideDto, guideSchemaShape } from "../dto/create-guide-schema";

const ThreatsSchema = guideSchemaShape.pick({
  threats: true,
  threatsDescription: true
})

type ThreatsDto = z.infer<typeof ThreatsSchema>

const resolver = zodResolver(ThreatsSchema)

type ThreatsProps = {
  championList: ChampionsDataDragonDetails[]
}

export default function ThreatsForm({ championList }: ThreatsProps) {
  const mainFormContext = useFormContext<CreateGuideDto>()
  const stepperContext = useStepperContext()

  const { control, handleSubmit } = useForm<ThreatsDto>({ resolver })

  const { fields, append, remove } = useFieldArray({ control, name: 'threats' })

  const appendThreat = () => {
    append({
      threat: '',
      description: ''
    })
  }

  const onSubmit = (formValues: any) => {
    stepperContext.nextStep()
    mainFormContext.setValues(formValues)
  }

  const getErrorFromIndex = (index: number) => {
    return mainFormContext.formState.errors.threats?.[index]
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.scroll}>
          <ScrollView>
            <FlatList
              data={fields}
              renderItem={({ index }) => {
                return (
                  <View
                    style={style.fieldContainer}
                  >
                    <AppSelectController
                      key={`${index}.threat`}
                      control={mainFormContext.control}
                      title={'Selecione uma ameaça'}
                      options={championList.map(({ id, name }) => ({ value: id, label: name }))}
                      placeholder={'Selecione uma ameaça'}
                      name={`threats.${index}.threat`}
                    />
                    <FormFieldErrors fieldError={getErrorFromIndex(index)?.threat} />

                    <AppInputController
                      key={`${index}.description`}
                      control={mainFormContext.control}
                      name={`threats.${index}.description`}
                      inputOptions={{
                        label: 'Descrição da ameaça',
                        placeholder: 'Descrição da ameaça',
                        multiline: true
                      }}
                    />
                    <FormFieldErrors fieldError={getErrorFromIndex(index)?.description} />

                    <StyledButton
                      onPress={() => { remove(index) }}
                    >
                      Remover ameaça
                    </StyledButton>
                  </View>
                )
              }} />
          </ScrollView>
        </View>
        <StyledButton
          style={styles.addThreat}
          onPress={appendThreat}
        >
          Adicionar ameaça
        </StyledButton>
      </View>
      <StepperFooter
        customNextButton={
          buildCustomButtonProps({
            onPress: handleSubmit(onSubmit)
          })
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  form: { flex: 1, gap: 16 },
  addThreat: { marginBottom: 16 }
})