import { getApproveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { RemoveLiquidityButton } from '../RemoveLiquidityButton'
import { StepConfig } from '../../useIterateSteps'
import { usePool } from '../../../usePool'
import { shouldUseRecoveryRemoveLiquidity } from '../../LiquidityActionHelpers'

export function useRemoveLiquidityStepConfigs(
  setRemoveLiquidityTxState: (transactionState: TransactionState) => void
) {
  const relayerMode = useRelayerMode()
  const { chainId, pool } = usePool()

  let stepConfigs: StepConfig[] = [
    {
      title: 'Remove liquidity',
      render() {
        return <RemoveLiquidityButton onTransactionStateUpdate={setRemoveLiquidityTxState} />
      },
    },
  ]

  if (relayerMode === 'approveRelayer' && !shouldUseRecoveryRemoveLiquidity(pool)) {
    stepConfigs = [getApproveRelayerConfig(chainId), ...stepConfigs]
  }

  return stepConfigs
}
