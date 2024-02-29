import { useConstructClaimAllRewardsStep } from '../../pool/actions/claim/useConstructClaimAllRewardsStep'
import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { VStack } from '@chakra-ui/react'
import { PoolListItem } from '../../pool/pool.types'

interface ClaimAllRewardsButtonProps {
  pool: PoolListItem
}

export function ClaimAllRewardsButton({ pool }: ClaimAllRewardsButtonProps) {
  const { claimAllRewardsStep } = useConstructClaimAllRewardsStep(pool)

  return (
    <VStack w="full">
      <TransactionStepButton step={claimAllRewardsStep} />
    </VStack>
  )
}
