import { ClaimButton } from '../pool/actions/claim/ClaimButton'
import { useConstructClaimVeBalRewardsStep } from '../pool/actions/claim/useConstructClaimVeBalRewardsStep'

export function useClaimProtocolRewardsStepConfigs() {
  const { claimAllVeBalRewardsStep } = useConstructClaimVeBalRewardsStep()

  const stepConfigs = [
    {
      title: 'Claim protocol revenue',
      render: () => <ClaimButton step={claimAllVeBalRewardsStep} />,
    },
  ]

  return {
    stepConfigs,
  }
}
