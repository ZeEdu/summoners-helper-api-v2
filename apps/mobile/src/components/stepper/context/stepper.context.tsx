import { createContext } from "react";

export type StepperContextProps = {
  stepperIndex: number;
  nextStep: () => void;
  previousStep: () => void;

  setDisableNextButton: React.Dispatch<React.SetStateAction<boolean>>;
  disableNextButton: boolean;
  setDisablePreviousButton: React.Dispatch<React.SetStateAction<boolean>>;
  disablePreviousButton: boolean;
}

export const StepperContext = createContext<StepperContextProps | undefined>(undefined)