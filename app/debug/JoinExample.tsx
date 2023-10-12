'use client'

import TransactionStepsButton from '@/components/btns/transaction-steps/TransactionStepsButton'
import { useConstructRelayerApprovalStep } from './steps/relayerApproval'

export function JoinExample() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { step: relayerApprovalStep, setApprovalArgs } = useConstructRelayerApprovalStep()

  //setApprovalArgs allows changing arguments
  // TODO: Should we extract useState here??'
  // TODO: Should we manage {userAddress} = useAccount externally and disable all FlowSteps globally?

  // return <TransactionStepButton transactionStep={transactionStep}></TransactionStepButton>
  return <TransactionStepsButton steps={[relayerApprovalStep]} />
}
