import { FlowStep, TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'
import networkConfig from '@/lib/config/networks/mainnet'
import { Address } from 'viem'
import { useUserAccount } from '../../../web3/useUserAccount'
import { useManagedTransaction } from '../../../web3/contracts/useManagedTransaction'
import { useClaimCallDataQuery } from './useClaimCallDataQuery'
import { selectStakingService } from '@/lib/modules/staking/selectStakingService'
import { GqlChain, GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'

interface UseConstructClaimAllRewardsStepArgs {
  gaugeAddresses: Address[]
  chain: GqlChain
  stakingType: GqlPoolStakingType
}

export function useConstructClaimAllRewardsStep({
  gaugeAddresses,
  chain,
  stakingType,
}: UseConstructClaimAllRewardsStepArgs) {
  const { isConnected } = useUserAccount()
  const shouldClaimMany = gaugeAddresses.length > 1
  const stakingService = selectStakingService(chain, stakingType)
  const { data: claimData } = useClaimCallDataQuery(gaugeAddresses, stakingService)

  const transactionLabels: TransactionLabels = {
    init: `Claim${shouldClaimMany ? ' all' : ''}`,
    confirming: 'Confirming...',
    confirmed: 'Claimed',
    tooltip: shouldClaimMany
      ? 'Claim all rewards from your gauges'
      : 'Claim all rewards from your gauge',
  }

  const claimAllRewardsTransaction = useManagedTransaction(
    networkConfig.contracts.balancer.relayerV6,
    'balancer.relayerV6',
    'multicall',
    transactionLabels,
    { args: [claimData] },
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
