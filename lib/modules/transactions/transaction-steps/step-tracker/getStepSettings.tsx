import {
  FlowStep,
  TransactionState,
  getTransactionState,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { ColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'

type StepStatus = 'active' | 'complete' | 'incomplete'

export type StepProps = {
  step: { title: string }
  index: number
  currentIndex: number
  colorMode: ColorMode
  isLastStep: boolean
  flowStep?: FlowStep
}

/*
  Generates an object used to render the UI state of a given step in the context of a multi-step flow
  It handles title, colors, loading states, etc
*/
export function getStepSettings({
  step,
  currentIndex,
  index,
  colorMode,
  flowStep,
  isLastStep,
}: StepProps) {
  const isActive = index === currentIndex

  const color = getColor(colorMode, getStatus(index), flowStep)

  const stepNumber = index + 1

  function getStatus(index: number): StepStatus {
    if (index < currentIndex) return 'complete'
    // When the last step is complete
    if (isActive && isLastStep && flowStep?.result.isSuccess) return 'complete'
    if (isActive) return 'active'
    return 'incomplete'
  }

  const status = getStatus(index)

  const isActiveLoading = isLoading(status, flowStep)

  return {
    title: step.title,
    color,
    isActive,
    status,
    stepNumber,
    isActiveLoading,
  }
}

function getColor(colorMode: ColorMode, status: StepStatus, flowStep?: FlowStep) {
  if (status === 'active') {
    return getActiveColor(flowStep)[colorMode]
  }
  if (status === 'complete') {
    return completeColor[colorMode]
  }
  if (status === 'incomplete') {
    return incompleteColor[colorMode]
  }
  return 'blue'
}

function getActiveColor(flowStep?: FlowStep) {
  if (isLoading('active', flowStep)) return activeConfirmingColor
  return activeColor
}

function isLoading(status: StepStatus, flowStep?: FlowStep): boolean {
  if (!flowStep) return false
  if (status !== 'active') return false
  if (getTransactionState(flowStep) === TransactionState.Loading) {
    return true
  }
  if (getTransactionState(flowStep) === TransactionState.Confirming) {
    return true
  }

  return false
}

/*
  Step Status Colors
  We show different colors depending on the step status and other variables like the step flow state
*/
const completeColor = {
  dark: 'green',
  light: 'green',
}

const incompleteColor = {
  dark: 'gray',
  light: 'gray',
}

const activeColor = {
  dark: 'gradient',
  light: 'blue',
}

// When the current step tx is waiting for wallet confirmation
const activeConfirmingColor = {
  dark: 'orange',
  light: 'orange',
}
