import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { approveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { minterApprovalConfig } from '@/lib/modules/staking/gauge/minterApprovalConfig'
import { ClaimAllRewardsButton } from '../../../portfolio/claim/ClaimAllRewardsButton'
import { Address } from 'viem'
import { GqlChain, GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'

export function useClaimStepConfigs(
  gaugeAddresses: Address[],
  chain: GqlChain,
  stakingType: GqlPoolStakingType
) {
  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer()

  let stepConfigs = [
    {
      render: () => (
        <ClaimAllRewardsButton
          gaugeAddresses={gaugeAddresses}
          chain={chain}
          stakingType={stakingType}
        />
      ),
    },
  ]

  if (!hasApprovedRelayer) {
    stepConfigs = [approveRelayerConfig, ...stepConfigs]
  }

  if (!hasMinterApproval) {
    stepConfigs = [minterApprovalConfig(chain), ...stepConfigs]
  }

  return stepConfigs
}
