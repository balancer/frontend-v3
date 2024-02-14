import { Address } from 'viem'
import { useConstructClaimAllRewardsStep } from './useConstructClaimAllRewardsStep'
import { ClaimButton } from './ClaimButton'

interface ClaimAllRewardsButtonProps {
  gaugeAddresses: Address[]
}

export function ClaimAllRewardsButton({ gaugeAddresses }: ClaimAllRewardsButtonProps) {
  const { claimAllRewardsStep } = useConstructClaimAllRewardsStep({ gaugeAddresses })
  return <ClaimButton step={claimAllRewardsStep} />
}
