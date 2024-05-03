'use client'

import { useState } from 'react'
import { TxStep } from './lib'

export function useTransactionSteps({ steps }: { steps: TxStep[] }) {
  const [txSteps, setTxSteps] = useState<TxStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)

  const currentStep = txSteps[currentStepIndex]

  return {
    txSteps,
    currentStep,
    currentStepIndex,
    setTxSteps,
    setCurrentStepIndex,
  }
}
