'use client'

import { useEffect, useState } from 'react'
import { TransactionStep2 } from './lib'
import { useTransactionState } from './TransactionStateProvider'

export type TransactionStepsResponse = ReturnType<typeof useTransactionSteps>

export function useTransactionSteps(steps: TransactionStep2[] = []) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const { getTransaction } = useTransactionState()

  function goToNextStep() {
    setCurrentStepIndex(prev => prev + 1)
  }

  function isLastStep(index: number) {
    return steps?.length ? index === steps.length - 1 : false
  }

  const currentStep = steps?.[currentStepIndex]
  const currentTransaction = currentStep ? getTransaction(currentStep.id) : undefined
  const isCurrentStepComplete = currentStep?.isComplete() || false

  // Trigger side effects on transaction completion. The step itself decides
  // when it's complete. e.g. so approvals can refectch to check correct
  // allowance has been given.
  useEffect(() => {
    // console.log('currentTransaction', currentTransaction?.execution.isSuccess)
    if (currentTransaction?.result.isSuccess) {
      currentStep?.onSuccess?.()
    }
  }, [currentTransaction?.result.isSuccess, currentStep])

  // Control step flow here.
  useEffect(() => {
    if (isCurrentStepComplete) goToNextStep()
  }, [isCurrentStepComplete])

  return {
    steps,
    currentStep,
    currentTransaction,
    currentStepIndex,
    goToNextStep,
    isLastStep,
    setCurrentStepIndex,
  }
}
