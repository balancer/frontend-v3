import { getApproveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { RemoveLiquidityButton } from '../RemoveLiquidityButton'
import { StepConfig } from '../../../../transactions/transaction-steps/useIterateSteps'
import { usePool } from '../../../usePool'
import { shouldUseRecoveryRemoveLiquidity } from '../../LiquidityActionHelpers'
import { signRelayerStep } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'

export function useRemoveLiquidityStepConfigs() {
  const relayerMode = useRelayerMode()
  const { chainId, pool } = usePool()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)

  let stepConfigs: StepConfig[] = [
    {
      title: 'Remove liquidity',
      render() {
        return <RemoveLiquidityButton />
      },
    },
  ]

  if (shouldSignRelayerApproval) {
    stepConfigs = [signRelayerStep, ...stepConfigs]
  }

  if (relayerMode === 'approveRelayer' && !shouldUseRecoveryRemoveLiquidity(pool)) {
    stepConfigs = [getApproveRelayerConfig(chainId), ...stepConfigs]
  }

  return stepConfigs
}
