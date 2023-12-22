import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { VStack } from '@chakra-ui/react'
import { useConstructRemoveLiquidityStep } from './useConstructRemoveLiquidityStep'

type Props = {
  poolId: string
}
export function RemoveLiquidityFlowButton({ poolId }: Props) {
  const { step: removeLiquidityStep } = useConstructRemoveLiquidityStep(poolId)
  const steps = [removeLiquidityStep]

  function handleRemoveCompleted() {
    console.log('Remove completed')
  }

  return (
    <VStack w="full">
      <TransactionFlow
        completedAlertContent="Successfully removed liquidity"
        onCompleteClick={handleRemoveCompleted}
        completedButtonLabel="Return to pool"
        steps={steps}
      />
    </VStack>
  )
}
