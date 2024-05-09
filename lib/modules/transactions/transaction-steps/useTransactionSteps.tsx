'use client'

import { useContext, useEffect, useState } from 'react'
import { getTransactionState, TransactionState, TransactionStep2 } from './lib'
import { useTransactionState } from './TransactionStateProvider'
import { AddLiquidityContext } from '../../pool/actions/add-liquidity/useAddLiquidity'

export type TransactionStepsResponse = ReturnType<typeof useTransactionSteps>

export function useTransactionSteps(steps: TransactionStep2[] = []) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const { getTransaction } = useTransactionState()

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
    setCurrentStepIndex(prev => prev + 1)
  }

  function isLastStep(index: number) {
    return steps?.length ? index === lastStepIndex : false
  }

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
    lastTransactionState,
    lastTransactionConfirmingOrConfirmed,
    goToNextStep,
    isLastStep,
    setCurrentStepIndex,
  }
}

/*
  Different local flow providers (Add/Remove/Swap...) are using the common useTransactionSteps hook.
  Generic shared components like StepTracker need to consume that common interface.
  This helper hook finds the current provider to avoid prop drilling.
*/
export function useTransactionStepsFromFlowProvider() {
  const addLiquidityContext = useContext(AddLiquidityContext)
  //const removeLiquidityContext = useContext(RemoveLiquidityContext)
  //const removeLiquidityContext = useContext(SwapContext)
  const flowProviders = [addLiquidityContext].filter(provider => provider !== null)
  if (flowProviders.length > 1) {
    throw new Error(
      `useTransactionStepsFromFlowProvider detected more than one flow provider context. This is a bug.`
    )
  }
  const currentFlowProvider = flowProviders[0]
  if (!currentFlowProvider) {
    throw new Error(
      `useTransactionStepsFromFlowProvider must be used within a flow provider context (add/remove/swap...)`
    )
  }
  return currentFlowProvider.transactionSteps
}
