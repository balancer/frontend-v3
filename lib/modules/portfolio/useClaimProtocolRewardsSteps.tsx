import { useClaimVeBalRewardsStep } from '../pool/actions/claim/useClaimVeBalRewardsStep'

export function useClaimProtocolRewardsSteps() {
  const step = useClaimVeBalRewardsStep()

  return {
    isLoadingSteps: false,
    steps: [step],
  }
}
