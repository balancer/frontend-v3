import { Address } from 'viem'
import { useConstructClaimAllRewardsStep } from './useConstructClaimAllRewardsStep'
import { ClaimButton } from './ClaimButton'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

interface ClaimAllRewardsButtonProps {
  gaugeAddresses: Address[]
  chain: GqlChain
}

export function ClaimAllRewardsButton({ gaugeAddresses, chain }: ClaimAllRewardsButtonProps) {
  const { claimAllRewardsStep } = useConstructClaimAllRewardsStep({ gaugeAddresses, chain })
  return <ClaimButton step={claimAllRewardsStep} />
}
