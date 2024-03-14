import { getApproveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { RemoveLiquidityButton } from '../RemoveLiquidityButton'
import { StepConfig } from '../../../../transactions/transaction-steps/useIterateSteps'
import { usePool } from '../../../usePool'

export function useRemoveLiquidityStepConfigs() {
  const relayerMode = useRelayerMode()
  const { chainId } = usePool()

  let stepConfigs: StepConfig[] = [
    {
      title: 'Remove liquidity',
      render() {
        return <RemoveLiquidityButton />
      },
    },
  ]

  if (relayerMode === 'approveRelayer') {
    stepConfigs = [getApproveRelayerConfig(chainId), ...stepConfigs]
  }

  return stepConfigs
}
