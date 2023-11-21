import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useEffect } from 'react'
import { Address } from 'wagmi'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { useAddLiquidityPoolConfig } from './useAddLiquidityPoolConfig'
import { usePoolStateInput } from '@/lib/shared/hooks/balancer-api/usePoolStateInput'

export function useConstructJoinPoolStep(poolId: Address) {
  // const [joinPayload, setJoinPayload] = useState<JoinPayload | null>(null)

  const { address: userAddress } = useUserAccount()
  const { chainId } = useNetworkConfig()

  const poolStateQuery = usePoolStateInput(poolId)

  const joinBuilder = new AddLiquidityConfigBuilder(chainId, poolStateQuery.data, 'unbalanced')

  joinBuilder.setAmountIn('0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', '1')
  joinBuilder.setAmountIn('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '1')

  const joinQuery = useAddLiquidityPoolConfig(joinBuilder, userAddress)

  // update relayer approval args
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  useEffect(() => {}, [])

  // if (!txConfig) return null

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
