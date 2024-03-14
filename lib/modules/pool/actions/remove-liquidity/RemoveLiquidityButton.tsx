import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { usePool } from '../../usePool'
import { Button, VStack } from '@chakra-ui/react'
import { usePoolRedirect } from '../../pool.hooks'
import { useConstructRemoveLiquidityStep } from './modal/useConstructRemoveLiquidityStep'
import { useRemoveLiquidity } from './useRemoveLiquidity'

export function RemoveLiquidityButton() {
  const { pool } = usePool()
  const { didRefetchPool } = useRemoveLiquidity()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  const { removeLiquidityStep } = useConstructRemoveLiquidityStep()

  const isComplete = removeLiquidityStep.isComplete()

  async function handlerRedirectToPoolPage(event: React.MouseEvent<HTMLElement>) {
    redirectToPoolPage(event)
  }

  return (
    <VStack w="full">
      {isComplete ? (
        <Button w="full" size="lg" onClick={handlerRedirectToPoolPage} isLoading={!didRefetchPool}>
          Return to pool
        </Button>
      ) : (
        <TransactionStepButton step={removeLiquidityStep} />
      )}
    </VStack>
  )
}
