import { Alert, Button, ButtonProps } from "@chakra-ui/react";
import React from "react"
import { TransactionStep } from "./lib";
import { TransactionStepButton } from "./TransactionStepButton";

type Props = {
  // the order of the steps is important, and must be provided in the order of desired execution
  steps: TransactionStep[]
}

export default function TransactionStepsButton({ children, steps, ...rest }: Props & ButtonProps) {
  const requiredSteps = steps.filter(step => !step.isComplete);
  const areAllStepsComplete = steps.every(step => step.isComplete);
  // since the order is expect, the active step is simply the first step in the remainder of steps 
  // that still need to be executed
  const activeStep = requiredSteps[0];

  const currentStepError = activeStep.execution.error || activeStep.simulation.error;
  return (
    <>
      {/* also render transaction state herre*/}
      {
        areAllStepsComplete &&
        <Alert width='fit-content'>Completed Flow</Alert >
      }
      {
        activeStep &&
        <TransactionStepButton step={activeStep} {...rest} />
      }
    </>
  )


}
