import { Address } from 'wagmi'
import { useEffect, useState } from 'react'
import { noUserAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useActiveStep } from './useActiveStep'

const batchRelayer = '0xfeA793Aa415061C483D2390414275AD314B3F621'

export function useConstructRelayerApprovalStep() {
  const { address: userAddress } = useUserAccount()
  const { isActiveStep, activateStep } = useActiveStep()

  // fetch relayer approval and set this flag
  const hasRelayerApproval = false
  // These args can be dynamic (i.e. from html input) and should be passed as args to the useConstructRelayerApprovalStep hook though setApprovalArgs
  const [approvalArgs, setApprovalArgs] = useState<[Address, Address, boolean]>([
    userAddress || noUserAddress,
    batchRelayer,
    true,
  ])

  // update relayer approval args
  useEffect(() => {
    if (userAddress) {
      setApprovalArgs([userAddress, batchRelayer, true])
    }
  }, [userAddress])

  const transaction = useManagedTransaction(
    'balancer.vaultV2',
    'setRelayerApproval',
    buildRelayerApprovalLabels(),
    { args: approvalArgs },
    {
      enabled: !!userAddress && isActiveStep,
      onSuccess: () => {
        console.log('Test on success hook.')
      },
    }
  )

  const step: FlowStep = {
    ...transaction,
    getLabels: buildRelayerApprovalLabels,
    id: 'batchRelayerApproval',
    stepType: 'batchRelayerApproval',
    isComplete: () => hasRelayerApproval,
    activateStep,
  }

  return {
    step,
    setApprovalArgs,
  }
}

/**
 * Examples to illustrate a potential api based on functions to decouple label responsibility
 * These functions can then be passed when composing the whole set of steps for a given transaction flow
 */
export const buildRelayerApprovalLabels: BuildTransactionLabels = () => {
  return {
    ready: 'Sign relayer approval',
    confirming: 'Signing relayer approval',
    confirmed: 'Signed relayer approval',
    reverted: 'Failed to approve relayer',
    tooltip: 'Your signature is required to use the relayer.',
  }
}
