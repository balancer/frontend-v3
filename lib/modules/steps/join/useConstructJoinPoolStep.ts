import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { usePoolStateInput } from '@/lib/shared/hooks/balancer-api/usePoolStateInput'
import { HumanAmount } from '@balancer/sdk'
import { Address } from 'wagmi'
import { JoinConfigBuilder } from './JoinConfigBuilder'
import { useJoinPoolConfig } from './useJoinPoolConfig'
import { useState } from 'react'
import { useActiveStep } from '../useActiveStep'
import { useTokenAllowances } from '../../web3/useTokenAllowances'

export function useConstructJoinPoolStep(poolId: Address, initialWethAmount: HumanAmount = '0') {
  const [wethHumanAmount, setWethHumanAmount] = useState<HumanAmount>(initialWethAmount)

  const { address: userAddress } = useUserAccount()
  const { isActiveStep, activateStep } = useActiveStep()
  const { chainId } = useNetworkConfig()

  const poolStateQuery = usePoolStateInput(poolId)

  const { allowances } = useTokenAllowances()

  const joinBuilder = new JoinConfigBuilder(chainId, allowances, poolStateQuery.data, 'unbalanced')
  joinBuilder.setAmountIn(wETHAddress, wethHumanAmount)
  joinBuilder.setAmountIn(wjAuraAddress, '1')

  const joinQuery = useJoinPoolConfig(joinBuilder, isActiveStep, userAddress)

  const labels = buildJoinPoolLabels(poolId)

  const transaction = useManagedSendTransaction(labels, joinQuery.data?.config)

  const step: FlowStep = {
    ...transaction,
    // TODO: simplify labels avoiding a callback as we are already passing them to useManagedSendTransaction
    getLabels: () => labels,
    id: `joinPool${poolId}`,
    stepType: 'joinPool',
    isComplete: () => false,
    activateStep,
  }

  return {
    step,
    joinPayload: joinBuilder,
    isLoading:
      transaction?.simulation.isLoading || transaction?.execution.isLoading || joinQuery.isLoading,
    error: transaction?.simulation.error || transaction?.execution.error || joinQuery.error,
    joinQuery,
    setWethHumanAmount,
  }
}

export const buildJoinPoolLabels: BuildTransactionLabels = (poolId: Address) => {
  return {
    ready: 'Join pool',
    confirming: 'Confirm pool join',
    tooltip: 'bing',
    description: `🎉 Joined pool ${poolId}`,
  }
}
