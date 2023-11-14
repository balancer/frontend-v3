import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { wETHAddress } from '@/lib/debug-helpers'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { usePoolStateInput } from '@/lib/shared/hooks/balancer-api/usePoolStateInput'
import { Address } from 'wagmi'
import { JoinConfigBuilder } from './JoinConfigBuilder'
import { useJoinPoolConfig } from './useJoinPoolConfig'
import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { useActiveStep } from '../useActiveStep'
import { HumanAmount } from '@balancer/sdk'
import { useState } from 'react'

export function useConstructNativeAssetJoinStep(
  poolId: Address,
  initialWethAmount: HumanAmount = '0'
) {
  const [wethHumanAmount, setWethHumanAmount] = useState<HumanAmount>(initialWethAmount)

  const { address: userAddress } = useUserAccount()
  const { chainId } = useNetworkConfig()

  const poolStateQuery = usePoolStateInput(poolId)
  const { activateStep, isActiveStep } = useActiveStep()
  const { allowances } = useTokenAllowances()

  const joinBuilder = new JoinConfigBuilder(
    chainId,
    allowances,
    poolStateQuery.data,
    'unbalancedNativeAsset'
  )

  joinBuilder.setAmountIn(wETHAddress, wethHumanAmount)

  const joinQuery = useJoinPoolConfig(joinBuilder, isActiveStep, userAddress)

  const transaction = useManagedSendTransaction(buildJoinPoolLabels(), joinQuery.data?.config)

  const step: FlowStep = {
    ...transaction,
    getLabels: buildJoinPoolLabels,
    stepType: 'joinPool',
    id: `nativeJoin${poolId}`,
    isComplete: () => false,
    activateStep,
  }

  return {
    step,
    joinPayload: joinBuilder,
    isLoading:
      transaction?.simulation.isLoading || transaction?.execution.isLoading || joinQuery.isLoading,
    error: transaction?.simulation.error || transaction?.execution.error || joinQuery.error,
    isError: transaction?.simulation.error || transaction?.execution.error || joinQuery.error,
    joinQuery,
    setWethHumanAmount,
  }
}

export const buildJoinPoolLabels: BuildTransactionLabels = () => {
  return {
    ready: 'Join pool',
    confirming: 'Confirm pool join',
    tooltip: '',
    description: 'Pool joined with ETH (native asset)',
  }
}
