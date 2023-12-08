import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { poolId } from '@/lib/debug-helpers'
import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { PoolStateInputResult } from '@/lib/shared/hooks/balancer-api/usePoolStateInput'
import { Address } from 'wagmi'
import { useActiveStep } from '../../../../shared/hooks/transaction-flows/useActiveStep'
import { AddLiquidityService } from './AddLiquidityService'
import { HumanAmountIn } from './add-liquidity.types'
import { useBuildAddLiquidityQuery } from './useBuildAddLiquidityQuery'

export function useConstructAddLiquidityStep(
  poolStateQuery: PoolStateInputResult,
  humanAmountsIn: HumanAmountIn[]
) {
  const { address: userAddress } = useUserAccount()
  const { isActiveStep, activateStep } = useActiveStep()
  const { chainId } = useNetworkConfig()

  const addLiquidityBuilder = new AddLiquidityService(chainId, poolStateQuery.data, 'unbalanced')

  const addLiquidityQuery = useBuildAddLiquidityQuery(
    addLiquidityBuilder,
    humanAmountsIn,
    isActiveStep,
    userAddress
  )

  const transactionLabels = buildAddLiquidityLabels(poolId)

  const transaction = useManagedSendTransaction(transactionLabels, addLiquidityQuery.data)

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
