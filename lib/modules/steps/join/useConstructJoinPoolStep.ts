import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { wETHAddress } from '@/lib/debug-helpers'
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

export function useConstructJoinPoolStep(poolId: Address, initialWethAmount: HumanAmount = '1') {
  const [wethHumanAmount, setWethHumanAmount] = useState<HumanAmount>(initialWethAmount)

  const { address: userAddress } = useUserAccount()
  const { chainId } = useNetworkConfig()

  const poolStateQuery = usePoolStateInput(poolId)

  const joinBuilder = new JoinConfigBuilder(chainId, poolStateQuery.data, 'unbalanced')

  //TODO: useState with joinBuilder???
  joinBuilder.setAmountIn('0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', '1')
  joinBuilder.setAmountIn(wETHAddress, wethHumanAmount)

  const joinQuery = useJoinPoolConfig(joinBuilder, userAddress)

  const transaction = useManagedSendTransaction(buildJoinPoolLabels(), joinQuery.data?.config)

  const step: FlowStep = {
    ...transaction,
    getLabels: buildJoinPoolLabels,
    stepId: 'joinPool',
    isComplete: false,
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
