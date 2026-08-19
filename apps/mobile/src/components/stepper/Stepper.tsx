import { useNavigation } from "@react-navigation/native";
import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react";
import { View } from "react-native";

type StepperContextProps = {
  stepperIndex: number;
  nextStep: () => void;
  previousStep: () => void;

  setDisableNextButton: React.Dispatch<React.SetStateAction<boolean>>;
  disableNextButton: boolean;
  setDisablePreviousButton: React.Dispatch<React.SetStateAction<boolean>>;
  disablePreviousButton: boolean;
}

export const StepperContext = createContext<StepperContextProps | undefined>(undefined)

export const useStepperContext = (): StepperContextProps => {
  const context = useContext(StepperContext)

  if (context === undefined) {
    throw new Error('StepperContext deve ser utilizado dentro de StepperProvider')
  }

  return context
}

export const StepperProvider = ({ children }: PropsWithChildren) => {
  const [stepperIndex, setStepperIndex] = useState(4)
  const [disableNextButton, setDisableNextButton] = useState(false)
  const [disablePreviousButton, setDisablePreviousButton] = useState(false)

  const nextStep = async () => {
    setStepperIndex(old => old + 1)
  }

  const previousStep = () => {
    setStepperIndex(old => old - 1)
  }

  const value = {
    stepperIndex,
    nextStep,
    previousStep,
    disableNextButton,
    setDisableNextButton,
    disablePreviousButton,
    setDisablePreviousButton
  }

  return (
    <StepperContext.Provider value={value}>
      {children}
    </StepperContext.Provider>
  )
}

type StepperItemProps = PropsWithChildren & {
  title: string;
}

export const StepperItem = ({ children, title }: StepperItemProps) => {
  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  )
}

type StepperProps = PropsWithChildren & {
  nextStepButtonTitle?: string;
  previousStepButtonTitle?: string;
}

export const Stepper = ({
  children
}: StepperProps) => {
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