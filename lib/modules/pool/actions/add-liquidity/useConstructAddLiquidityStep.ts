import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { HumanAmount } from '@balancer/sdk'
import { useState } from 'react'
import { Address } from 'wagmi'
import { useTokenAllowances } from '../../../web3/useTokenAllowances'
import { useActiveStep } from '../../../../shared/hooks/transaction-flows/useActiveStep'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { useBuildAddLiquidityQuery } from './useBuildAddLiquidityQuery'
import { PoolStateInputResult } from '@/lib/shared/hooks/balancer-api/usePoolStateInput'

export function useConstructAddLiquidityStep(
  poolStateQuery: PoolStateInputResult,
  initialWethAmount: HumanAmount = '0'
) {
  const [wethHumanAmount, setWethHumanAmount] = useState<HumanAmount>(initialWethAmount)

  const { address: userAddress } = useUserAccount()
  const { isActiveStep, activateStep } = useActiveStep()
  const { chainId } = useNetworkConfig()

  const { allowances } = useTokenAllowances()

  const addLiquidityBuilder = new AddLiquidityConfigBuilder(
    chainId,
    allowances,
    poolStateQuery.data,
    'unbalanced'
  )
  addLiquidityBuilder.setAmountIn(wETHAddress, wethHumanAmount)
  addLiquidityBuilder.setAmountIn(wjAuraAddress, '1')

  const addLiquidityQuery = useBuildAddLiquidityQuery(
    addLiquidityBuilder,
    isActiveStep,
    userAddress
  )

  const transactionLabels = buildAddLiquidityLabels(poolId)

  const transaction = useManagedSendTransaction(transactionLabels, addLiquidityQuery.data?.config)

  const step: FlowStep = {
    ...transaction,
    transactionLabels,
    id: `joinPool${poolId}`,
    stepType: 'joinPool',
    isComplete: () => false,
    activateStep,
  }

  return {
    step,
    joinPayload: addLiquidityBuilder,
    isLoading:
      transaction?.simulation.isLoading ||
      transaction?.execution.isLoading ||
      addLiquidityQuery.isLoading,
    error: transaction?.simulation.error || transaction?.execution.error || addLiquidityQuery.error,
    joinQuery: addLiquidityQuery,
    setWethHumanAmount,
  }
}

export const buildAddLiquidityLabels: BuildTransactionLabels = (poolId: Address) => {
  return {
    init: 'Add pool liquidity',
    confirming: 'Confirm add liquidity',
    tooltip: 'TODO',
    description: `🎉 Liquidity added to pool ${poolId}`,
  }
}
