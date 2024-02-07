import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { ClaimAndUnstakeButton } from './ClaimAndUnstakeButton'
import { useHasMinterApproval } from './useHasMinterApproval'
import { approveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { minterApprovalConfig } from './minterApprovalConfig'

export function useClaimAndUnstakeStepConfigs() {
  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer()

  let stepConfigs = [
    {
      render: () => <ClaimAndUnstakeButton />,
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
