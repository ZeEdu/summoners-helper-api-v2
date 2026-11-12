import { useNavigation } from "@react-navigation/native";
import { PropsWithChildren, ReactNode, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import useI18n from "../../contexts/i18n/useI18n";
import { useStepperContext } from "./context";

type StepperProps = PropsWithChildren & {
  nextStepButtonTitle?: string;
  previousStepButtonTitle?: string;
}

export default function Stepper({
  children
}: StepperProps) {
  const i18n = useI18n()

  if (!Array.isArray(children)) {
    throw new Error(i18n.t('stepper.error'))
  }

  const stepperContext = useStepperContext()
  const navigation = useNavigation()

  const childrenMap = children.reduce((previous, current, index) => {
    return { ...previous, [index]: current }
  }, {} as Record<number, ReactNode>)

  useEffect(() => {
    navigation.setOptions({
      title: (childrenMap[stepperContext.stepperIndex].props.title)
    })
  }, [navigation, stepperContext.stepperIndex])

  useEffect(() => {
    stepperContext.setDisableNextButton((stepperContext.stepperIndex + 1) === children.length)
    stepperContext.setDisablePreviousButton(stepperContext.stepperIndex === 0)
  }, [stepperContext.stepperIndex])

  return (
    <View style={styles.flex}>
      <View style={styles.flex}>
        {childrenMap[stepperContext.stepperIndex]}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  }
})