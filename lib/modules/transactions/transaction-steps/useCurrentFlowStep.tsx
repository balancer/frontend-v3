'use client'

/* eslint-disable react-hooks/exhaustive-deps */
import { FlowStep } from '@/lib/modules/transactions/transaction-steps/lib'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'

export function _useCurrentFlowStep() {
  const [flowStep, setCurrentFlowStep] = useState<FlowStep | undefined>()

  return { flowStep, setCurrentFlowStep }
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

export function useUpdateCurrentFlowStep(step: FlowStep) {
  const { setCurrentFlowStep } = useCurrentFlowStep()
  useEffect(() => {
    setCurrentFlowStep(step)
  }, [step.id, step.simulation.status, step.execution.status])
}
