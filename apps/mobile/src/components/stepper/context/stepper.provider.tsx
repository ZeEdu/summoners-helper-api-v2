import { PropsWithChildren, useState } from 'react';
import { StepperContext } from './stepper.context';

export const StepperProvider = ({ children }: PropsWithChildren) => {
  const [stepperIndex, setStepperIndex] = useState(8);
  const [disableNextButton, setDisableNextButton] = useState(false);
  const [disablePreviousButton, setDisablePreviousButton] = useState(false);

  const nextStep = async () => {
    setStepperIndex((old) => old + 1);
  };

  const previousStep = () => {
    setStepperIndex((old) => old - 1);
  };

  const value = {
    stepperIndex,
    nextStep,
    previousStep,
    disableNextButton,
    setDisableNextButton,
    disablePreviousButton,
    setDisablePreviousButton,
  };

  return (
    <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
  );
};