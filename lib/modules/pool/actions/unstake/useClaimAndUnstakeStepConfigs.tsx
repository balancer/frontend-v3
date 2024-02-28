import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { ClaimAndUnstakeButton } from './ClaimAndUnstakeButton'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { approveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { minterApprovalConfig } from '@/lib/modules/staking/gauge/minterApprovalConfig'
import { StepConfig } from '../useIterateSteps'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export function useClaimAndUnstakeStepConfigs(chain: GqlChain) {
  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer()

  let stepConfigs: StepConfig[] = [
    {
      title: 'Claim and unstake',
      render: () => <ClaimAndUnstakeButton />,
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
