import { useContext } from "react"
import useI18n from "../../../contexts/i18n/useI18n"
import { StepperContext, StepperContextProps } from "./stepper.context"

export const useStepperContext = (): StepperContextProps => {
  const context = useContext(StepperContext)
  const i18n = useI18n()

  if (context === undefined) {
    throw new Error(i18n.t('stepper.contextError'))
  }

  return context
}