'use client'

import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { ManagedResult, TransactionStep2 } from './lib'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'

export function _useTransactionSteps() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [transactionSteps, setTransactionSteps] = useState<TransactionStep2[]>([])
  const [transactionMap, setTransactionMap] = useState<Map<string, ManagedResult>>(new Map())

  function updateTransactionMap(k: string, v: ManagedResult) {
    setTransactionMap(new Map(transactionMap.set(k, v)))
  }

  function getTransaction(id: string) {
    return transactionMap.get(id)
  }

  function goToNextStep() {
    setCurrentStepIndex(prev => prev + 1)
  }

  function isLastStep(index: number) {
    return index === transactionSteps.length - 1
  }

  const currentStep = transactionSteps[currentStepIndex]
  const currentTransaction = transactionMap.get(currentStep.id)
  const isCurrentStepComplete = currentStep.isComplete()

  // Trigger side effects on transaction completion. The step itself decides
  // when it's complete. e.g. so approvals can refectch to check correct
  // allowance has been given.
  useEffect(() => {
    console.log('currentTransaction', currentTransaction?.execution.isSuccess)
    if (currentTransaction?.execution.isSuccess) {
      currentStep.onSuccess?.()
    }
  }, [currentTransaction?.execution.isSuccess, currentStep])

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
    setTransactionSteps,
    setCurrentStepIndex,
    getTransaction,
    updateTransactionMap,
  }
}

export type Result = ReturnType<typeof _useTransactionSteps>
export const TransactionStepsContext = createContext<Result | null>(null)

export function TransactionStepsProvider({ children }: PropsWithChildren) {
  const hook = _useTransactionSteps()

  return (
    <TransactionStepsContext.Provider value={hook}>{children}</TransactionStepsContext.Provider>
  )
}

export const useTransactionSteps = (): Result =>
  useMandatoryContext(TransactionStepsContext, 'TransactionSteps')
