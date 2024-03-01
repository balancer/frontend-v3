import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { getApproveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { minterApprovalConfig } from '@/lib/modules/staking/gauge/minterApprovalConfig'
import { ClaimAllRewardsButton } from '../../../portfolio/claim/ClaimAllRewardsButton'
import { getChainId } from '@/lib/config/app.config'
import { PoolListItem } from '../../pool.types'

export function useClaimStepConfigs(pools: PoolListItem[]) {
  const pool = pools[0]
  const { chain } = pool
  const chainId = getChainId(chain)
  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer(chainId)

  let stepConfigs = [
    {
      render: () => <ClaimAllRewardsButton pools={pools} />,
    },
  ]

  if (!hasApprovedRelayer) {
    stepConfigs = [getApproveRelayerConfig(chainId), ...stepConfigs]
  }

  if (!hasMinterApproval) {
    stepConfigs = [minterApprovalConfig(chain), ...stepConfigs]
  }

  return stepConfigs
}
