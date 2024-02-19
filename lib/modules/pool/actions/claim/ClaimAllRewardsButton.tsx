import { Address } from 'viem'
import { useConstructClaimAllRewardsStep } from './useConstructClaimAllRewardsStep'
import { ClaimButton } from './ClaimButton'
import { GqlChain, GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'

interface ClaimAllRewardsButtonProps {
  gaugeAddresses: Address[]
  chain: GqlChain
  stakingType: GqlPoolStakingType
}

export function ClaimAllRewardsButton({
  gaugeAddresses,
  chain,
  stakingType,
}: ClaimAllRewardsButtonProps) {
  const { claimAllRewardsStep } = useConstructClaimAllRewardsStep({
    gaugeAddresses,
    chain,
    stakingType,
  })

  return <ClaimButton step={claimAllRewardsStep} />
}
