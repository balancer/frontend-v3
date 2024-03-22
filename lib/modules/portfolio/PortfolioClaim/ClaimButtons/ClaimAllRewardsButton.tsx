import { useConstructClaimAllRewardsStep } from '../../../pool/actions/claim/useConstructClaimAllRewardsStep'
import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { VStack } from '@chakra-ui/react'
import { PoolListItem } from '../../../pool/pool.types'

interface ClaimAllRewardsButtonProps {
  pools: PoolListItem[]
}

export function ClaimAllRewardsButton({ pools }: ClaimAllRewardsButtonProps) {
  const { claimAllRewardsStep } = useConstructClaimAllRewardsStep(pools)

  return (
    <VStack w="full">
      <TransactionStepButton step={claimAllRewardsStep} />
    </VStack>
  )
}
