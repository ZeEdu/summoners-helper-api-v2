import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";
import z from "zod";
import AppInputController from "../../../../../components/forms/AppInputController";
import FormFieldErrors from "../../../../../components/forms/FormFieldErrors";
import { useStepperContext } from "../../../../../components/stepper/context";
import StepperFooter, { buildCustomButtonProps } from "../../../../../components/stepper/StepperFooter";
import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import { ChampionsDataDragonDetailsSolo } from "../../../../../dtos/champion.dto";
import { CreateGuideDto, guideSchemaShape, keyFromLvlsBuilder, LvlKey, lvlsArrayBuilder } from "../dto/create-guide-schema";

export const abilitiesProgressionSchema = guideSchemaShape.pick({
  abilitiesProgression: true,
  abilitiesProgressionDescription: true,
})

export type AbilitiesProgressionDto = z.infer<typeof abilitiesProgressionSchema>

type Props = {
  championData: ChampionsDataDragonDetailsSolo,
}

const resolver = zodResolver(abilitiesProgressionSchema)

const keymapIndex = {
  0: 'q',
  1: 'w',
  2: 'e',
  3: 'r',
}

type KeymapIndexType = keyof typeof keymapIndex

enum AbilityOption {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
}

const indexToAbilityOption = {
  0: AbilityOption.A,
  1: AbilityOption.B,
  2: AbilityOption.C,
  3: AbilityOption.D,
}

export default function GuideAbilitiesProgressionForm({ championData }: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const { version } = usePatchVersion()

  const mainFormContext = useFormContext<CreateGuideDto>()
  const stepperContext = useStepperContext()

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValues
  } = useForm<AbilitiesProgressionDto>({
    resolver,
    defaultValues: {
      abilitiesProgression: {
        l1: undefined,
        l2: undefined,
        l3: undefined,
        l4: undefined,
        l5: undefined,
        l6: undefined,
        l7: undefined,
        l8: undefined,
        l9: undefined,
        l10: undefined,
        l11: undefined,
        l12: undefined,
        l13: undefined,
        l14: undefined,
        l15: undefined,
        l16: undefined,
        l17: undefined,
        l18: undefined,
      },
      abilitiesProgressionDescription: ''
    }
  })

  const onSubmit = (formValues: AbilitiesProgressionDto) => {
    stepperContext.nextStep()
    mainFormContext.setValues(formValues)
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

  const setFieldOnDraft = (key: LvlKey, index: number) => {
    const value = indexToAbilityOption[index as KeymapIndexType]

    const formValues = getValues()

    setValues({
      ...formValues,
      abilitiesProgression: {
        ...formValues.abilitiesProgression,
        [key]: value
      }
    })
  }

  const isSelected = (levelKey: LvlKey, index: number) => {
    const value = indexToAbilityOption[index as KeymapIndexType]
    const abilitiesProgression = getValues('abilitiesProgression')

    return abilitiesProgression[levelKey] === value
  }

  return (
    <View style={styles.mainContainer}>
      <View>
        <AppInputController
          control={control}
          name={"abilitiesProgressionDescription"}
          inputOptions={{
            label: "Progressão das abilidades",
            placeholder: "Descrição da Progressão das abilidades",
            multiline: true
          }} />
        <FormFieldErrors fieldError={errors.abilitiesProgressionDescription} />
      </View>
      <View style={styles.headerContainer}>
        {
          championData.spells
            .map((ability, index) => {
              const keymap = keymapIndex[(index as KeymapIndexType)]
              const uri = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${championData.id}${keymap.toUpperCase()}.png`
              return (
                <View
                  key={ability.id}
                  style={styles.headerColumnsContainer}
                >
                  <Image
                    style={styles.headerImage}
                    source={{ uri }}
                  />
                  <Text style={styles.headerTitle}>{ability.name}</Text>
                </View>
              )
            })
        }
      </View>
      <ScrollView>
        <View style={styles.levelSelectionContainer}>
          {championData.spells.map((_, index) => {
            return (
              <FlatList
                data={lvlsArrayBuilder()}
                keyExtractor={(level) => level.toString()}
                style={styles.list}
                renderItem={({ item: level }) => {
                  return (
                    <Pressable
                      onPress={() => setFieldOnDraft(keyFromLvlsBuilder(level), index)}
                      style={[
                        styles.listItemContainer,
                        {
                          backgroundColor: isSelected(keyFromLvlsBuilder(level), index) ? theme.colors.onPrimaryContainer : theme.colors.onPrimary,
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.listItemText, {
                            color: isSelected(keyFromLvlsBuilder(level), index) ? theme.colors.onPrimary : theme.colors.onPrimaryContainer
                          }
                        ]}
                      >
                        {level}
                      </Text>
                    </Pressable>
                  )
                }}
              />
            )
          })}
        </View>
      </ScrollView>
      <StepperFooter
        customNextButton={
          buildCustomButtonProps({
            onPress: handleSubmit(onSubmit),
          })
        }
      />
    </View>
  )
}

const makeStyles = ({ roundness }: MD3Theme) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      gap: 12,
      marginTop: 16
    },
    headerContainer: {
      flexDirection: 'row'
    },
    headerColumnsContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 8
    },
    headerImage: {
      width: 64,
      height: 64,
      borderRadius: roundness,
    },
    headerTitle: {
      textAlign: 'center'
    },
    levelSelectionContainer: {
      flexDirection: 'row',
      marginBottom: 16
    },
    list: {
      flex: 1
    },
    listItemContainer: {
      marginHorizontal: 'auto',
      marginTop: 16,
      width: 64,
      height: 64,
      borderRadius: roundness,
      display: "flex",
      justifyContent: 'center',
    },
    listItemText: {
      textAlign: 'center',
    }
  })
}