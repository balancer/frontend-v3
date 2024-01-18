/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Button, ButtonProps, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { FlowStep } from './lib'
import { TransactionStepButton } from './TransactionStepButton'
import { ReactNode } from 'react'

type Props = {
  // the order of the steps is important, and must be provided in the order of desired execution
  steps: FlowStep[]

  // when the flow is complete, this callback function will be executed
  // this is useful for actions such as navigating the user on a successful
  // completion, closing a modal, etc
  // IMPORTANT: This is executed automatically
  onComplete?: () => void

  // callback to execute on the button that will be shown to users once the
  // flow is complete
  onCompleteClick: () => void

  // label to show on the completed flow button
  completedButtonLabel: string

  // custom content to render in the success alert box
  completedAlertContent: ReactNode
}

export default function TransactionFlow({
  steps,
  completedButtonLabel,
  onCompleteClick,
  onComplete,
  completedAlertContent,
  ...rest
}: Props & ButtonProps) {
  const requiredSteps = steps.filter(step => !step.isComplete())
  const areAllStepsComplete = steps.every(step => step.isComplete())
  // since the order is expect, the active step is simply the first step in the remainder of steps
  // that still need to be executed
  const activeStep = requiredSteps[0]
  // console.log('Active step is: ', activeStep.id)
  const showCompletedContent = areAllStepsComplete && completedAlertContent !== undefined

  // side effect, automatically execute the onComplete
  // callback once everything is complete
  useEffect(() => {
    console.log('Are all steps complete?', areAllStepsComplete)

    if (areAllStepsComplete) {
      onComplete?.()
    }
  }, [areAllStepsComplete])

  // notify step activation
  useEffect(() => {
    // console.log('Chaging activeStep to', activeStep.id)
    activeStep.activateStep() //TODO: also deactivate previous steps (is that necessary, we could skip it if we use enabled with completed but thats dangerous, this is probably easier)
  }, [activeStep.id])

  return (
    <>
      {areAllStepsComplete && (
        <VStack width="full">
          {showCompletedContent && (
            <Alert rounded="md" status="success">
              {completedAlertContent}
            </Alert>
          )}
          <Button w="full" size="lg" variant="primary" onClick={onCompleteClick}>
            {completedButtonLabel}
          </Button>
        </VStack>
      )}
      {activeStep && <TransactionStepButton step={activeStep} {...rest} />}
    </>
  )
}
