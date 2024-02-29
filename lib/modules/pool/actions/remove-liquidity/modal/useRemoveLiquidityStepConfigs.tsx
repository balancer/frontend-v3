import { getApproveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { RemoveLiquidityButton } from '../RemoveLiquidityButton'
import { StepConfig } from '../../useIterateSteps'
import { usePool } from '../../../usePool'

export function useRemoveLiquidityStepConfigs(
  setRemoveLiquidityTxState: (transactionState: TransactionState) => void
) {
  const relayerMode = useRelayerMode()
  const { pool, chainId } = usePool()

  let stepConfigs: StepConfig[] = [
    {
      render() {
        return <RemoveLiquidityButton onTransactionStateUpdate={setRemoveLiquidityTxState} />
      },
    },
  ]

  if (relayerMode === 'approveRelayer') {
    stepConfigs = [getApproveRelayerConfig(chainId), ...stepConfigs]
  }

  return stepConfigs
}
