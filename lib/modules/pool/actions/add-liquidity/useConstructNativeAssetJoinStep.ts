import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { wETHAddress } from '@/lib/debug-helpers'
import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { usePoolStateInput } from '@/lib/shared/hooks/balancer-api/usePoolStateInput'
import { Address } from 'wagmi'
import { useActiveStep } from '../../../../shared/hooks/transaction-flows/useActiveStep'
import { AddLiquidityService } from './AddLiquidityService'
import { useBuildAddLiquidityQuery } from './useBuildAddLiquidityQuery'
import { HumanAmountIn } from './add-liquidity.types'

export function useConstructNativeAssetJoinStep(poolId: Address) {
  // const [joinPayload, setJoinPayload] = useState<JoinPayload | null>(null)

  const { address: userAddress } = useUserAccount()
  const { chainId } = useNetworkConfig()

  const poolStateQuery = usePoolStateInput(poolId)
  const { activateStep, isActiveStep } = useActiveStep()

  const joinBuilder = new AddLiquidityService(chainId, poolStateQuery.data, 'unbalancedNativeAsset')

  const humanAmountsIn: HumanAmountIn[] = [{ tokenAddress: wETHAddress, humanAmount: '1' }]

  const joinQuery = useBuildAddLiquidityQuery(
    joinBuilder,
    humanAmountsIn,
    isActiveStep,
    userAddress
  )

  const transaction = useManagedSendTransaction(buildAddLiquidityLabels(), joinQuery.data?.config)

  const step: FlowStep = {
    ...transaction,
    transactionLabels: buildAddLiquidityLabels(),
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
  }
}

export const buildAddLiquidityLabels: BuildTransactionLabels = () => {
  return {
    init: 'Add pool liquidity',
    confirming: 'Confirm add pool liquidity',
    tooltip: '',
    description: 'Pool liquidity added with ETH (native asset)',
  }
}
