import { FlowStep } from '@/components/btns/transaction-steps/lib'
import { usePoolStateInput } from '@/lib/balancer-api/usePoolStateInput'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { BuildTransactionLabels } from '@/lib/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/contracts/useManagedSendTransaction'
import { wETHAddress } from '@/lib/debug-helpers'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Address } from 'wagmi'
import { JoinConfigBuilder } from './JoinConfigBuilder'
import { useJoinPoolConfig } from './useJoinPoolConfig'

export function useConstructNativeAssetJoinStep(poolId: Address) {
  // const [joinPayload, setJoinPayload] = useState<JoinPayload | null>(null)

  const { address: userAddress } = useUserAccount()
  const { chainId } = useNetworkConfig()

  const poolStateQuery = usePoolStateInput(poolId)

  const joinBuilder = new JoinConfigBuilder(chainId, poolStateQuery.data, 'unbalancedNativeAsset')

  joinBuilder.setAmountIn(wETHAddress, '1')

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
    isError: transaction?.simulation.error || transaction?.execution.error || joinQuery.error,
    joinQuery,
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
