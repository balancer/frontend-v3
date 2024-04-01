'use client'

/* eslint-disable react-hooks/exhaustive-deps */
import {
  CoreStepId,
  FlowStep,
  TransactionState,
  getTransactionState,
  isCoreStep,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'

export function _useCurrentFlowStep() {
  const [flowStep, setCurrentFlowStep] = useState<FlowStep | undefined>()

  const isFlowComplete: boolean = isCoreStep(flowStep?.id) && !!flowStep?.result.isSuccess

  /*
    We are only interested in the state of the flow step if it is a concrete CoreStepId
  */
  function getCoreTransactionState(coreStepId: CoreStepId) {
    if (flowStep?.id !== coreStepId) return TransactionState.Ready
    return getTransactionState(flowStep)
  }

  function clearCurrentFlowStep() {
    setCurrentFlowStep(undefined)
  }

  return {
    flowStep,
    isFlowComplete,
    setCurrentFlowStep,
    clearCurrentFlowStep,
    getCoreTransactionState,
  }
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
