'use client'

import { useConstructRelayerApprovalStep } from './steps/relayerApproval'
import { TransactionStepButton } from './TransactionStepButton'

export function JoinExample() {
  const { transactionStep, setApprovalArgs } = useConstructRelayerApprovalStep()

  //setApprovalArgs allows changing arguments
  // TODO: Should we extract useState here??'
  // TODO: Should we manage {userAddress} = useAccount externally and disable all FlowSteps globally?

  return <TransactionStepButton transactionStep={transactionStep}></TransactionStepButton>
}
