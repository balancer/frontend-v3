import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { approveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { minterApprovalConfig } from '@/lib/modules/staking/gauge/minterApprovalConfig'
import { ClaimAllRewardsButton } from './ClaimAllRewardsButton'
import { Address } from 'viem'
import { Pool } from '../../usePool'

export function useClaimStepConfigs(gaugeAddresses: Address[], pool: Pool) {
  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer()

  let stepConfigs = [
    {
      render: () => <ClaimAllRewardsButton gaugeAddresses={gaugeAddresses} pool={pool} />,
    },
  ]

  if (!hasApprovedRelayer) {
    stepConfigs = [approveRelayerConfig, ...stepConfigs]
  }

  if (!hasMinterApproval) {
    stepConfigs = [minterApprovalConfig, ...stepConfigs]
  }

  return stepConfigs
}
