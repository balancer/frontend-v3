import { FlowStep, TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'

import { Address } from 'viem'
import { useUserAccount } from '../../../web3/useUserAccount'

import { useManagedTransaction } from '../../../web3/contracts/useManagedTransaction'
import { useClaimCallDataQuery } from './useClaimCallDataQuery'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import networkConfigs from '@/lib/config/networks'

interface UseConstructClaimAllRewardsStepArgs {
  gaugeAddresses: Address[]
  chain: GqlChain
}

export function useConstructClaimAllRewardsStep({
  gaugeAddresses,
  chain,
}: UseConstructClaimAllRewardsStepArgs) {
  const { isConnected } = useUserAccount()

  const shouldClaimMany = gaugeAddresses.length > 1
  const { data: claimData } = useClaimCallDataQuery(gaugeAddresses)

  const transactionLabels: TransactionLabels = {
    init: `Claim${shouldClaimMany ? ' all' : ''}`,
    confirming: 'Confirming...',
    confirmed: 'Claimed',
    tooltip: shouldClaimMany
      ? 'Claim all rewards from your gauges'
      : 'Claim all rewards from your gauge',
  }

  const claimAllRewardsTransaction = useManagedTransaction(
    networkConfigs[chain].contracts.balancer.relayerV6,
    'balancer.relayerV6',
    'multicall',
    transactionLabels,
    { args: [claimData as Address[]] },
    { enabled: gaugeAddresses.length > 0 && claimData && claimData.length > 0 }
  )

  const claimAllRewardsStep: FlowStep = {
    ...claimAllRewardsTransaction,
    transactionLabels,
    id: 'claimAllRewards',
    stepType: 'claim',
    isComplete: () => isConnected && claimAllRewardsStep.result.isSuccess,
  }

  return {
    claimAllRewardsStep,
  }
}
