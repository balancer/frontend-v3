'use client'

import { useEffect, useState } from 'react'
import { ManagedResult, TransactionStep2 } from './lib'
import { useTransactionMap } from './TransactionMapProvider'

export function useTransactionSteps(transactionSteps: TransactionStep2[] = []) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [currentTransactionStep, setCurrentTransactionStep] = useState<ManagedResult>()
  const { getTransaction } = useTransactionMap()

  function goToNextStep() {
    setCurrentStepIndex(prev => prev + 1)
  }

  function isLastStep(index: number) {
    return transactionSteps?.length ? index === transactionSteps.length - 1 : false
  }

  const currentStep = transactionSteps?.[currentStepIndex]
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
    transactionSteps,
    currentStep,
    currentTransaction,
    currentStepIndex,
    goToNextStep,
    isLastStep,
    setCurrentStepIndex,
    currentTransactionStep,
    setCurrentTransactionStep,
  }
}

export type TransactionStepsResult = ReturnType<typeof useTransactionSteps>
