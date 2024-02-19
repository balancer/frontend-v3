import { Address } from 'viem'
import { useConstructClaimAllRewardsStep } from './useConstructClaimAllRewardsStep'
import { GqlChain, GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'
import { VStack } from '@chakra-ui/react'
import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'

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

  return (
    <VStack w="full">
      <TransactionStepButton step={claimAllRewardsStep} />
    </VStack>
  )
}
