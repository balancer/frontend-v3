import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { approveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { minterApprovalConfig } from '@/lib/modules/staking/gauge/minterApprovalConfig'
import { ClaimAllRewardsButton } from '../../../portfolio/claim/ClaimAllRewardsButton'
import { PoolListItem } from '../../pool.types'

export function useClaimStepConfigs(pool: PoolListItem) {
  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer()

  let stepConfigs = [
    {
      render: () => <ClaimAllRewardsButton pool={pool} />,
    },
  ]

  if (!hasApprovedRelayer) {
    stepConfigs = [approveRelayerConfig, ...stepConfigs]
  }

  if (!hasMinterApproval) {
    stepConfigs = [minterApprovalConfig(pool.chain), ...stepConfigs]
  }

  return stepConfigs
}
