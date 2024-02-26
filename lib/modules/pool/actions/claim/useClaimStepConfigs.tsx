import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { approveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { minterApprovalConfig } from '@/lib/modules/staking/gauge/minterApprovalConfig'
import { ClaimAllRewardsButton } from './ClaimAllRewardsButton'
import { Address } from 'viem'
import { GqlChain, GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'
import { StepConfig } from '../useIterateSteps'

export function useClaimStepConfigs(
  gaugeAddresses: Address[],
  chain: GqlChain,
  stakingType: GqlPoolStakingType
) {
  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer()

  let stepConfigs: StepConfig[] = [
    {
      description: 'Claim',
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
    stepConfigs = [minterApprovalConfig, ...stepConfigs]
  }

  return stepConfigs
}
