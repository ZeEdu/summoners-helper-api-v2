import { StyleSheet, View } from "react-native";
import { Button, ButtonProps } from "react-native-paper";
import useI18n from "../../contexts/i18n/useI18n";
import { useStepperContext } from "./context";

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
  const i18n = useI18n()

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
        {customPreviousButtonText || i18n.t('stepper.footer.previous')}
      </Button>
    )
  }

  return (
    <View style={styles.container}>
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
                    <Button {...customNextButton} />
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
                      {nextButtonText || i18n.t('stepper.footer.next')}
                    </Button>
                  )
              }
            </>
          )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8
  }
})