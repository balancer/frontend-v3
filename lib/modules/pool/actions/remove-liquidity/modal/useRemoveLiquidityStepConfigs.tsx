import { getApproveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { RemoveLiquidityButton } from '../RemoveLiquidityButton'
import { StepConfig } from '../../useIterateSteps'
import { usePool } from '../../../usePool'
import { getChainId } from '@/lib/config/app.config'

export function useRemoveLiquidityStepConfigs(
  setRemoveLiquidityTxState: (transactionState: TransactionState) => void
) {
  const relayerMode = useRelayerMode()
  const { pool } = usePool()

  let stepConfigs: StepConfig[] = [
    {
      render() {
        return <RemoveLiquidityButton onTransactionStateUpdate={setRemoveLiquidityTxState} />
      },
    },
  ]

  if (relayerMode === 'approveRelayer') {
    const chainId = getChainId(pool.chain)
    stepConfigs = [getApproveRelayerConfig(chainId), ...stepConfigs]
  }

  return stepConfigs
}
