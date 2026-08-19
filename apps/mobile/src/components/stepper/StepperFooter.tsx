import { ReactNode } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { useStepperContext } from "./context";

type Props = {
  customPreviousButtonText?: string;
  customNextButtonText?: string;
  customNextButton?: () => ReactNode
}

export default function StepperFooter({
  customPreviousButtonText,
  customNextButtonText,
  customNextButton
}: Props) {
  const stepperContext = useStepperContext()

  return (
    <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
      <Button
        mode="contained-tonal"
        style={{ flex: 1 }}
        disabled={stepperContext.disablePreviousButton}
        onPress={() => {
          stepperContext.previousStep()
        }}>
        {customPreviousButtonText || 'Passo anterior'}
      </Button>
      {customNextButton ? (
        customNextButton()
      ) : (
        <Button
          mode="contained"
          style={{ flex: 1 }}
          disabled={stepperContext.disableNextButton}
          onPress={() => {
            stepperContext.nextStep()
          }}
        >
          {customNextButtonText || 'Próximo passo'}
        </Button>
      )
      }
    </View>
  )
}