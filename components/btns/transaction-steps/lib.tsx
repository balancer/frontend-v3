import { TransactionInfo } from '@/lib/contracts/contract.types'

type TransactionLabels = {
  label: string
  loadingLabel: string
  confirmingLabel: string
  stepTooltip: string
}

type StepId = 'batchRelayerApproval' | 'tokenApproval'

export type TransactionStep = {
  stepId: StepId
  getLabels: (args?: any) => TransactionLabels
  simulation: TransactionInfo['simulation']
  execution: TransactionInfo['execution']
  result: TransactionInfo['result']
  isComplete: boolean
}

// Allows adding extra properties like set state callbacks to TransactionStep
export type TransactionStepHook = {
  transactionStep: TransactionStep
}
