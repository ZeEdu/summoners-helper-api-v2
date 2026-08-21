import { StyleSheet, View } from "react-native";
import { Button, ButtonProps } from "react-native-paper";
import { useStepperContext } from "./context";

type Props = {
  customPreviousButtonText?: string;
  nextButtonText?: string;
  customNextButton?: ButtonProps
}

type ButtonPropsWithOptionalChildren = Omit<ButtonProps, 'children'> & {
  children?: React.ReactNode
}

const styles = StyleSheet.create({
  footerButton: {
    flex: 1
  }
})

export const buildCustomButtonProps = (buttonProps: ButtonPropsWithOptionalChildren): ButtonProps => {
  return {
    children: 'Próximo passo',
    mode: "contained",
    style: styles.footerButton,
    ...buttonProps,
  }
}

export default function StepperFooter({
  customPreviousButtonText,
  nextButtonText,
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
        <Button {...customNextButton}>
          {customNextButton.children}
        </Button>
      ) : (
        <Button
          mode="contained"
          style={{ flex: 1 }}
          disabled={stepperContext.disableNextButton}
          onPress={() => {
            stepperContext.nextStep()
          }}
        >
          {nextButtonText || 'Próximo passo'}
        </Button>
      )
      }
    </View>
  )
}