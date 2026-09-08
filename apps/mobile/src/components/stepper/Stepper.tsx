import { useNavigation } from "@react-navigation/native";
import { PropsWithChildren, ReactNode, useEffect } from "react";
import { View } from "react-native";
import { useStepperContext } from "./context";

type StepperProps = PropsWithChildren & {
  nextStepButtonTitle?: string;
  previousStepButtonTitle?: string;
}

export default function Stepper({
  children
}: StepperProps) {
  if (!Array.isArray(children)) {
    throw new Error('Deve passar mais de um elemento')
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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {childrenMap[stepperContext.stepperIndex]}
      </View>
    </View>
  )
}