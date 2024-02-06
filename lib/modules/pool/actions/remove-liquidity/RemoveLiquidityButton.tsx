/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { useEffect } from 'react'
import { usePool } from '../../usePool'
import { Button, VStack } from '@chakra-ui/react'
import { usePoolRedirect } from '../../pool.hooks'
import {
  TransactionState,
  getTransactionState,
} from '@/lib/shared/components/btns/transaction-steps/lib'
import { useConstructRemoveLiquidityStep } from './modal/useConstructRemoveLiquidityStep'
import { useRemoveLiquidity } from './useRemoveLiquidity'

export type Props = {
  onTransactionStateUpdate: (transactionState: TransactionState) => void
}

export function RemoveLiquidityButton({ onTransactionStateUpdate }: Props) {
  const { pool } = usePool()
  const { didRefetchPool } = useRemoveLiquidity()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  const { removeLiquidityStep, removeLiquidityTransaction } = useConstructRemoveLiquidityStep()

  const isComplete = removeLiquidityStep.isComplete()

  // To be used by Timeout component to freeze queries
  const transactionState = getTransactionState(removeLiquidityTransaction)
  useEffect(() => {
    onTransactionStateUpdate(transactionState)
  }, [transactionState])

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
