import { ClaimButton } from '../../../pool/actions/claim/ClaimButton'
import { useConstructClaimVeBalRewardsStep } from '@/lib/modules/pool/actions/claim/useConstructClaimVeBalRewardsStep'

export function ClaimAllVebalRewardsButton() {
  const { claimAllVeBalRewardsStep } = useConstructClaimVeBalRewardsStep()
  return <ClaimButton step={claimAllVeBalRewardsStep} />
}
