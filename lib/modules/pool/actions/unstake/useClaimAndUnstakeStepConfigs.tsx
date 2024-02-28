import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { ClaimAndUnstakeButton } from './ClaimAndUnstakeButton'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { getApproveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { minterApprovalConfig } from '@/lib/modules/staking/gauge/minterApprovalConfig'
import { usePool } from '../../usePool'
import { getChainId } from '@/lib/config/app.config'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export function useClaimAndUnstakeStepConfigs(chain: GqlChain) {
  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer()
  const { pool } = usePool()

  let stepConfigs = [
    {
      render: () => <ClaimAndUnstakeButton />,
    },
  ]

  if (!hasApprovedRelayer) {
    const chainId = getChainId(pool.chain)
    stepConfigs = [getApproveRelayerConfig(chainId), ...stepConfigs]
  }

  if (!hasMinterApproval) {
    stepConfigs = [minterApprovalConfig(chain), ...stepConfigs]
  }

  return stepConfigs
}
