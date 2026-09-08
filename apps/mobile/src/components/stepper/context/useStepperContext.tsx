import { useContext } from "react"
import { StepperContext, StepperContextProps } from "./stepper.context"

export const useStepperContext = (): StepperContextProps => {
  const context = useContext(StepperContext)

  if (context === undefined) {
    throw new Error('StepperContext deve ser utilizado dentro de StepperProvider')
  }

  return context
}