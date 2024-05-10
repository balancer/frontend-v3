/* eslint-disable react-hooks/exhaustive-deps */
import {
  TransactionLabels,
  TransactionStep2,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { parseUnits } from 'viem'
import { BPT_DECIMALS } from '../../pool.constants'
import { Pool } from '../../usePool'
import { selectStakingService } from '@/lib/modules/staking/selectStakingService'
import { useUnstakeGaugeCallDataQuery } from './useUnstakeGaugeCallDataQuery'
import { getNetworkConfig } from '@/lib/config/app.config'
import { ManagedTransactionInput } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { useBalTokenRewards } from '@/lib/modules/portfolio/PortfolioClaim/useBalRewards'
import { useClaimableBalances } from '@/lib/modules/portfolio/PortfolioClaim/useClaimableBalances'
import { PoolListItem } from '../../pool.types'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { useMemo } from 'react'
import { ManagedTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'
import { useTransactionState } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'

const claimAndUnstakeStepId = 'claim-and-unstake'

export function useClaimAndUnstakeStep(pool: Pool): { isLoading: boolean; step: TransactionStep2 } {
  const { getTransaction } = useTransactionState()
  const { contracts, chainId } = getNetworkConfig(pool.chain)

  const convertedPool = pool as unknown as PoolListItem // need to change type going from pool to pools for hooks
  const { claimableRewards: nonBalrewards } = useClaimableBalances([convertedPool])
  const { balRewardsData: balRewards } = useBalTokenRewards([convertedPool])

  const labels: TransactionLabels = {
    init: 'Claim & unstake',
    title: 'Claim & unstake',
    confirming: 'Confirming...',
    confirmed: `BPT withdrawn from  ${pool.staking?.type}!`,
    tooltip: 'TODO WITHDRAW TOOLTIP',
  }

  const stakingService = pool.staking
    ? selectStakingService(pool.chain, pool.staking?.type)
    : undefined
  const { data, isLoading } = useUnstakeGaugeCallDataQuery(
    parseUnits(pool.userBalance?.stakedBalance || '0', BPT_DECIMALS),
    stakingService,
    nonBalrewards.length > 0,
    balRewards.length > 0
  )

  const txSimulationMeta = sentryMetaForWagmiSimulation(
    'Error in wagmi tx simulation (Claim and unstake transaction)',
    {
      poolId: pool.id,
      chainId,
      unstakeArgs: data,
    }
  )

  const props: ManagedTransactionInput = {
    contractAddress: contracts.balancer.relayerV6,
    contractId: 'balancer.relayerV6',
    functionName: 'multicall',
    labels,
    chainId,
    args: [data],
    enabled: !!pool && !!isLoading,
    txSimulationMeta,
  }

  const transaction = getTransaction(claimAndUnstakeStepId)

  const isComplete = () => transaction?.result.isSuccess || false

  const step = useMemo(
    (): TransactionStep2 => ({
      id: claimAndUnstakeStepId,
      stepType: 'claimAndUnstake',
      labels,
      isComplete,
      renderAction: () => <ManagedTransactionButton id={claimAndUnstakeStepId} {...props} />,
    }),
    [transaction, data, isLoading]
  )

  return {
    isLoading,
    step,
  }
}
