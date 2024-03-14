'use client'

/* eslint-disable react-hooks/exhaustive-deps */
import {
  CoreStepId,
  FlowStep,
  TransactionState,
  getTransactionState,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'

export function _useCurrentFlowStep() {
  const [flowStep, setCurrentFlowStep] = useState<FlowStep | undefined>()

  /*
    True when the coreStepId transaction is completed or confirming
  */
  function getShouldFreezeQuote(coreStepId: CoreStepId) {
    const addLiquidityTxState = getCoreTransactionState(coreStepId)
    const isConfirmingAddLiquidity = addLiquidityTxState === TransactionState.Confirming
    const isAwaitingUserConfirmation = addLiquidityTxState === TransactionState.Loading
    const isComplete = addLiquidityTxState === TransactionState.Completed

    // Disable query refetches:
    // if the flow is complete
    // if the core transaction is confirming
    return isComplete || isConfirmingAddLiquidity || isAwaitingUserConfirmation
  }

  /*
    We are only interested in the state of the flow step if it is a concrete CoreStepId
  */
  function getCoreTransactionState(coreStepId: CoreStepId) {
    if (flowStep?.id !== coreStepId) return TransactionState.Ready
    return getTransactionState(flowStep)
  }

  return { flowStep, setCurrentFlowStep, getCoreTransactionState, getShouldFreezeQuote }
}

export type Result = ReturnType<typeof _useCurrentFlowStep>
export const CurrentFlowStepContext = createContext<Result | null>(null)

export function CurrentFlowStepProvider({ children }: PropsWithChildren) {
  const validation = _useCurrentFlowStep()

  return (
    <CurrentFlowStepContext.Provider value={validation}>{children}</CurrentFlowStepContext.Provider>
  )
}

export const useCurrentFlowStep = (): Result =>
  useMandatoryContext(CurrentFlowStepContext, 'CurrentFlowStep')

export function useSyncCurrentFlowStep(step: FlowStep): FlowStep {
  const { setCurrentFlowStep } = useCurrentFlowStep()
  useEffect(() => {
    setCurrentFlowStep(step)
  }, [step.id, step.simulation.status, step.execution.status, step.result.status])
  return step
}
