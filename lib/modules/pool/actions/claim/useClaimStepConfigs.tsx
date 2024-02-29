import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { getApproveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { minterApprovalConfig } from '@/lib/modules/staking/gauge/minterApprovalConfig'
import { ClaimAllRewardsButton } from '../../../portfolio/claim/ClaimAllRewardsButton'
import { getChainId } from '@/lib/config/app.config'
import { PoolListItem } from '../../pool.types'

export function useClaimStepConfigs(pool: PoolListItem) {
  const chainId = getChainId(pool.chain)
  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer(chainId)

  let stepConfigs = [
    {
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
