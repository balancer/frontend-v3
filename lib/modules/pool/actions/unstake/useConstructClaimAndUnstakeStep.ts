/* eslint-disable react-hooks/exhaustive-deps */
import { FlowStep, TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'
import { parseUnits } from 'viem'
import { BPT_DECIMALS } from '../../pool.constants'
import { usePool } from '../../usePool'
import { selectStakingService } from '@/lib/modules/staking/selectStakingService'
import { useUnstakeGaugeCallDataQuery } from './useUnstakeGaugeCallDataQuery'
import { getNetworkConfig } from '@/lib/config/app.config'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'

export function useConstructClaimAndUnstakeStep() {
  const { pool } = usePool()
  const networkConfig = getNetworkConfig(pool.chain)

  const transactionLabels: TransactionLabels = {
    init: 'Claim & unstake',
    confirming: 'Confirming...',
    confirmed: `BPT withdrawn from  ${pool.staking?.type}!`,
    tooltip: 'TODO WITHDRAW TOOLTIP',
  }

  const stakingService = pool.staking
    ? selectStakingService(pool.chain, pool.staking?.type)
    : undefined
  const { data } = useUnstakeGaugeCallDataQuery(
    parseUnits(pool.userBalance?.stakedBalance || '0', BPT_DECIMALS),
    stakingService
  )

  const claimAndUnstakeTransaction = useManagedTransaction(
    networkConfig.contracts.balancer.relayerV6,
    'balancer.relayerV6',
    'multicall',
    transactionLabels,
    { args: [data] },
    { enabled: !!pool }
  )

  const claimAndUnstakeStep: FlowStep = {
    ...claimAndUnstakeTransaction,
    transactionLabels,
    id: 'claimAndUnstake',
    stepType: 'claimAndUnstake',
    isComplete: () => claimAndUnstakeTransaction.result.isSuccess,
  }

  return {
    claimAndUnstakeStep,
    claimAndUnstakeTransaction,
  }
}
