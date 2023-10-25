import { Address } from 'wagmi'
import { useEffect, useState } from 'react'
import { noUserAddress } from '@/lib/contracts/wagmi-helpers'
import { useManagedTransaction } from '@/lib/contracts/useManagedTransaction'
import { BuildTransactionLabels } from '@/lib/contracts/transactionLabels'
import { FlowStep } from '@/components/btns/transaction-steps/lib'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

const balancerRelayer = '0xfeA793Aa415061C483D2390414275AD314B3F621'

export function useConstructRelayerApprovalStep() {
  const { address: userAddress } = useUserAccount()
  // fetch relayer approval and set this flag
  const hasRelayerApproval = false
  // These args can be dynamic (i.e. from html input) and should be passed as args to the useConstructRelayerApprovalStep hook though setApprovalArgs
  const [approvalArgs, setApprovalArgs] = useState<[Address, Address, boolean]>([
    userAddress || noUserAddress,
    balancerRelayer,
    true,
  ])

  // update relayer approval args
  useEffect(() => {
    if (userAddress) {
      setApprovalArgs([userAddress, balancerRelayer, true])
    }
  }, [userAddress])

  const transaction = useManagedTransaction(
    'balancer.vaultV2',
    'setRelayerApproval',
    { args: approvalArgs },
    {
      enabled: !!userAddress,
      onSuccess: () => {
        console.log('Test on success hook.')
      },
    }
  )

  const step: FlowStep = {
    ...transaction,
    getLabels: buildRelayerApprovalLabels,
    stepId: 'batchRelayerApproval',
    isComplete: hasRelayerApproval,
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
    tooltip: 'Your signature is required to use the relayer.',
    description: 'bing',
  }
}
