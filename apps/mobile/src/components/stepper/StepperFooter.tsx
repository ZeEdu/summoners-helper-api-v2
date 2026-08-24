import { StyleSheet, View } from "react-native";
import { Button, ButtonProps } from "react-native-paper";
import { useStepperContext } from "./context";

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

type Props = {
  customPreviousButtonText?: string;
  nextButtonText?: string;
  customNextButton?: ButtonProps;
  goBackOnly?: boolean
}

export default function StepperFooter({
  customPreviousButtonText,
  nextButtonText,
  customNextButton,
  goBackOnly = false
}: Props) {
  const stepperContext = useStepperContext()

  const GoBackButton = () => {
    return (
      <Button
        mode="contained-tonal"
        style={{ flex: 1 }}
        disabled={stepperContext.disablePreviousButton}
        onPress={() => {
          stepperContext.previousStep()
        }}
      >
        {customPreviousButtonText || 'Passo anterior'}
      </Button>
    )
  }

  return (
    <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
      {
        goBackOnly ?
          (
            <GoBackButton />
          ) :
          (
            <>
              <GoBackButton />
              {
                customNextButton ?
                  (
                    <Button {...customNextButton}>
                      {customNextButton.children}
                    </Button>
                  ) :
                  (
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
            </>
          )
      }
    </View>
  )
}