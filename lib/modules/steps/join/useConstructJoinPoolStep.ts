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

export function useConstructJoinPoolStep(poolId: Address, initialWethAmount: HumanAmount = '1') {
  const [wethHumanAmount, setWethHumanAmount] = useState<HumanAmount>(initialWethAmount)

  const { address: userAddress } = useUserAccount()
  const { isActiveStep, activateStep } = useActiveStep()
  const { chainId } = useNetworkConfig()

  const poolStateQuery = usePoolStateInput(poolId)

  const joinBuilder = new JoinConfigBuilder(chainId, poolStateQuery.data, 'unbalanced')

  //TODO: useState with joinBuilder???
  // console.log('updating weth amount', wethHumanAmount)
  joinBuilder.setAmountIn(wETHAddress, wethHumanAmount)
  joinBuilder.setAmountIn(wjAuraAddress, '1')

  const joinQuery = useJoinPoolConfig(joinBuilder, isActiveStep, userAddress)

  const transaction = useManagedSendTransaction(buildJoinPoolLabels(), joinQuery.data?.config)

  const step: FlowStep = {
    ...transaction,
    getLabels: buildJoinPoolLabels,
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

export const buildJoinPoolLabels: BuildTransactionLabels = () => {
  return {
    ready: 'Join pool',
    confirming: 'Confirm pool join',
    tooltip: 'bing',
    description: 'bong',
  }
}
