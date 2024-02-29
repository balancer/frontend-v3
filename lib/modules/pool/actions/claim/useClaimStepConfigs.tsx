import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { minterApprovalConfig } from '@/lib/modules/staking/gauge/minterApprovalConfig'
import { ClaimAllRewardsButton } from '../../../portfolio/claim/ClaimAllRewardsButton'
import { getApproveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { getChainId } from '@/lib/config/app.config'
import { PoolListItem } from '../../pool.types'
import { StepConfig } from '../useIterateSteps'

export function useClaimStepConfigs(pool: PoolListItem) {
  const chainId = getChainId(pool.chain)
  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer(chainId)

  let stepConfigs: StepConfig[] = [
    {
      title: 'Claim',
      render: () => <ClaimAllRewardsButton pool={pool} />,
    },
  ]

  if (!hasApprovedRelayer) {
    stepConfigs = [getApproveRelayerConfig(chainId), ...stepConfigs]
  }

  if (!hasMinterApproval) {
    stepConfigs = [minterApprovalConfig(pool.chain), ...stepConfigs]
  }

  return stepConfigs
}
