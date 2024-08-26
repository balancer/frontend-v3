import { getChainId } from '@/lib/config/app.config'
import networkConfigs from '@/lib/config/networks'
import { selectStakingService } from '@/lib/modules/staking/selectStakingService'
import { ManagedTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'
import { useTransactionState } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import {
  TransactionLabels,
  TransactionStep,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { GqlChain, GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { useMemo, useState } from 'react'
import { ManagedTransactionInput } from '../../../web3/contracts/useManagedTransaction'
import { useUserAccount } from '../../../web3/UserAccountProvider'
import { useClaimCallDataQuery } from './useClaimCallDataQuery'
import { BalTokenRewardsResult } from '@/lib/modules/portfolio/PortfolioClaim/useBalRewards'
import { ClaimableBalancesResult } from '@/lib/modules/portfolio/PortfolioClaim/useClaimableBalances'
import { allClaimableGaugeAddressesFor } from '../../pool.helpers'
import { ClaimablePool } from './ClaimProvider'

const claimAllRewardsStepId = 'claim-all-rewards'

export type ClaimAllRewardsStepParams = {
  pools: ClaimablePool[]
  claimableBalancesQuery: ClaimableBalancesResult
  balTokenRewardsQuery: BalTokenRewardsResult
}

export function useClaimAllRewardsStep({
  pools,
  claimableBalancesQuery,
  balTokenRewardsQuery,
}: ClaimAllRewardsStepParams) {
  const [isClaimQueryEnabled, setIsClaimQueryEnabled] = useState(false)
  const { getTransaction } = useTransactionState()
  const { isConnected } = useUserAccount()
  const { claimableRewards: nonBalRewards, refetchClaimableRewards } = claimableBalancesQuery
  const { balRewardsData: balRewards, refetchBalRewards } = balTokenRewardsQuery

  const pool = pools[0] // TODO: Should check if pools is empty
  const chain = pool.chain as GqlChain
  const stakingType = pool.staking?.type || GqlPoolStakingType.Gauge
  const gaugeAddresses = pools.flatMap(pool => allClaimableGaugeAddressesFor(pool))
  const shouldClaimMany = gaugeAddresses.length > 1
  const stakingService = selectStakingService(chain, stakingType)
  const { data: claimData, isLoading } = useClaimCallDataQuery(
    gaugeAddresses,
    stakingService,
    nonBalRewards.length > 0,
    balRewards.length > 0,
    isClaimQueryEnabled
  )

  const labels: TransactionLabels = {
    init: `Claim${shouldClaimMany ? ' all' : ''}`,
    title: `Claim${shouldClaimMany ? ' all' : ''}`,
    confirming: 'Confirming claim...',
    confirmed: 'Claimed!',
    tooltip: shouldClaimMany
      ? 'Claim all rewards from your gauges'
      : 'Claim all rewards from your gauge',
  }

  const txSimulationMeta = sentryMetaForWagmiSimulation(
    'Error in wagmi tx simulation (Claim all rewards transaction)',
    {
      poolId: pool.id,
      chain,
      claimData,
      stakingType,
      gaugeAddresses,
    }
  )

  const props: ManagedTransactionInput = {
    labels,
    chainId: getChainId(chain),
    contractId: 'balancer.relayerV6',
    contractAddress: networkConfigs[chain].contracts.balancer.relayerV6,
    functionName: 'multicall',
    args: [claimData],
    enabled: gaugeAddresses.length > 0 && claimData && claimData.length > 0,
    txSimulationMeta,
  }

  const transaction = getTransaction(claimAllRewardsStepId)

  const isComplete = () => isConnected && !!transaction?.result.isSuccess

  const step = useMemo(
    (): TransactionStep => ({
      id: claimAllRewardsStepId,
      labels,
      stepType: 'claim',
      isComplete,
      onActivated: () => setIsClaimQueryEnabled(true),
      onDeactivated: () => setIsClaimQueryEnabled(false),
      onSuccess: () => {
        refetchClaimableRewards()
        refetchBalRewards()
      },
      renderAction: () => <ManagedTransactionButton id={claimAllRewardsStepId} {...props} />,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transaction, claimData, isLoading]
  )
  return { step, isLoading }
}
