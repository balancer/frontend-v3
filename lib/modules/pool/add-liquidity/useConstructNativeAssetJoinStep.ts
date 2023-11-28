import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { wETHAddress } from '@/lib/debug-helpers'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { usePoolStateInput } from '@/lib/shared/hooks/balancer-api/usePoolStateInput'
import { Address } from 'wagmi'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { useBuildAddLiquidityQuery } from './useBuildAddLiquidityQuery'
import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { useActiveStep } from '../../../shared/hooks/transaction-flows/useActiveStep'

export function useConstructNativeAssetJoinStep(poolId: Address) {
  // const [joinPayload, setJoinPayload] = useState<JoinPayload | null>(null)

  const { address: userAddress } = useUserAccount()
  const { chainId } = useNetworkConfig()

  const poolStateQuery = usePoolStateInput(poolId)
  const { activateStep, isActiveStep } = useActiveStep()
  const { allowances } = useTokenAllowances()

  const joinBuilder = new AddLiquidityConfigBuilder(
    chainId,
    allowances,
    poolStateQuery.data,
    'unbalancedNativeAsset'
  )

  joinBuilder.setAmountIn(wETHAddress, '1')

  const joinQuery = useBuildAddLiquidityQuery(joinBuilder, isActiveStep, userAddress)

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
