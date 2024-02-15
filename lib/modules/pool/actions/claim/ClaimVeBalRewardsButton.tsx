import { ClaimButton } from './ClaimButton'

import { useConstructClaimVeBalRewardsStep } from './useConstructClaimVeBalRewardsStep'

export function ClaimVeBalRewardsButton() {
  const { claimAllVeBalRewardsStep } = useConstructClaimVeBalRewardsStep()
  return <ClaimButton step={claimAllVeBalRewardsStep} />
}
