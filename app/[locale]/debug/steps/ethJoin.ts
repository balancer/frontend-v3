import { Address, useAccount } from 'wagmi'
import { TransactionStep } from '../TransactionStep'
import { useState } from 'react'
import { noUserAddress } from '@/lib/contracts/wagmi-helpers'
import { useManagedTransaction } from '@/lib/contracts/useManagedTransaction'
import { BuildTransactionLabels } from '@/lib/contracts/transactionLabels'
import { BalancerSDK } from '@balancer-labs/sdk'

const balancerRelayer = '0xfeA793Aa415061C483D2390414275AD314B3F621'

export function useConstructEthJoinStep() {
  const { address: userAddress } = useAccount()
  // These args can be dynamic (i.e. from html input) and should be passed as args to the useConstructRelayerApprovalStep hook though setApprovalArgs
  const [approvalArgs, setApprovalArgs] = useState<[Address, Address, boolean]>([
    userAddress || noUserAddress,
    balancerRelayer,
    true,
  ])

  // Use old SDK until we have new version available from the API

  const transactionInfo = useManagedTransaction(
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

  const transactionStep: TransactionStep = {
    transactionInfo,
    getLabels: buildRelayerApprovalLabels,
    stepId: 'batchRelayerApproval',
  }
  return {
    transactionStep,
    setApprovalArgs,
  }
}

/**
 * Examples to illustrate a potential api based on functions to decouple label responsibility
 * These functions can then be passed when composing the whole set of steps for a given transaction flow
 */
export const buildRelayerApprovalLabels: BuildTransactionLabels = () => {
  return {
    label: 'Sign relayer approval',
    loadingLabel: 'Confirm in wallet',
    confirmingLabel: 'Signing relayer approval',
    stepTooltip: 'Your signature is required to use the relayer.',
  }
}
