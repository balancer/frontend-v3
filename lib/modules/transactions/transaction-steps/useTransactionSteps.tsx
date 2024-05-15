/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { getTransactionState, TransactionState, TransactionStep } from './lib'
import { useTransactionState } from './TransactionStateProvider'
import useSound from 'use-sound'

export type TransactionStepsResponse = ReturnType<typeof useTransactionSteps>

export function useTransactionSteps(steps: TransactionStep[] = [], isLoading = false) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const { getTransaction } = useTransactionState()
  const [playGong] = useSound('/sounds/gong.mp3')

  const currentStep = steps?.[currentStepIndex]
  const currentTransaction = currentStep ? getTransaction(currentStep.id) : undefined
  const isCurrentStepComplete = currentStep?.isComplete() || false
  const lastStepIndex = steps?.length ? steps.length - 1 : 0
  const lastStep = steps?.[lastStepIndex]
  const lastTransaction = lastStep ? getTransaction(lastStep.id) : undefined

  const lastTransactionState = getTransactionState(lastTransaction)
  const lastTransactionConfirmingOrConfirmed =
    lastTransactionState === TransactionState.Confirming ||
    lastTransactionState === TransactionState.Completed

  function goToNextStep() {
    if (currentStepIndex === lastStepIndex) return
    setCurrentStepIndex(prev => prev + 1)
  }

  function isLastStep(index: number) {
    return steps?.length ? index === lastStepIndex : false
  }

  // Trigger side effects on transaction completion. The step itself decides
  // when it's complete. e.g. so approvals can refetch to check correct
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
  }, [currentStepIndex, isCurrentStepComplete])

  // On step change, call activation callbacks if they exist
  useEffect(() => {
    // Run deactivation callbacks first
    steps.forEach((step, index) => {
      if (index !== currentStepIndex) step.onDeactivated?.()
    })

    steps?.[currentStepIndex]?.onActivated?.()
  }, [currentStepIndex, isLoading, steps.length])

  // On last transaction success, play success sound.
  // TODO move this to a global tx state management system in later refactor.
  useEffect(() => {
    if (lastTransaction?.result.isSuccess) {
      playGong()
    }
  }, [lastTransaction?.result.isSuccess])

  return {
    steps,
    isLoading,
    currentStep,
    currentTransaction,
    currentStepIndex,
    lastTransaction,
    lastTransactionState,
    lastTransactionConfirmingOrConfirmed,
    goToNextStep,
    isLastStep,
    setCurrentStepIndex,
  }
}
