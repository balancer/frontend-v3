import { approveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import {
  OnTransactionStateUpdate,
  TransactionState,
} from '@/lib/shared/components/btns/transaction-steps/lib'
import { RemoveLiquidityButton } from '../RemoveLiquidityButton'
import { StepConfig } from '../../useIterateSteps'

export function buildRemoveLiquidityConfig(
  onTransactionStateUpdate: OnTransactionStateUpdate
): StepConfig {
  function render() {
    return <RemoveLiquidityButton onTransactionStateUpdate={onTransactionStateUpdate} />
  }
  return { render }
}

export function useRemoveLiquidityStepConfigs(
  setRemoveLiquidityTxState: (transactionState: TransactionState) => void
) {
  const relayerMode = useRelayerMode()

  let stepConfigs = [buildRemoveLiquidityConfig(setRemoveLiquidityTxState)]

  if (relayerMode === 'approveRelayer') {
    stepConfigs = [approveRelayerConfig, ...stepConfigs]
  }

  return stepConfigs
}
