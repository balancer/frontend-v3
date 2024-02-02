/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { useEffect, useState } from 'react'
import { usePool } from '../../usePool'
import { Button, VStack } from '@chakra-ui/react'
import { usePoolRedirect } from '../../pool.hooks'
import {
  TransactionState,
  getTransactionState,
} from '@/lib/shared/components/btns/transaction-steps/lib'
import { useConstructRemoveLiquidityStep } from './modal/useConstructRemoveLiquidityStep'

export type Props = {
  onTransactionStateUpdate: (transactionState: TransactionState) => void
}

export function RemoveLiquidityButton({ onTransactionStateUpdate }: Props) {
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const { refetch, pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  const { removeLiquidityStep, removeLiquidityTransaction } = useConstructRemoveLiquidityStep()

  const isComplete = removeLiquidityStep.isComplete()

  // To be used by Timeout component to freeze queries
  const transactionState = getTransactionState(removeLiquidityTransaction)
  useEffect(() => {
    onTransactionStateUpdate(transactionState)
  }, [transactionState])

  useEffect(() => {
    async function reFetchPool() {
      await refetch()
      setDidRefetchPool(true)
    }
    if (isComplete) reFetchPool()
  }, [isComplete])

  async function handlerRedirectToPoolPage(event: React.MouseEvent<HTMLElement>) {
    redirectToPoolPage(event)
  }

  return (
    <VStack w="full">
      {!isComplete && <TransactionStepButton step={removeLiquidityStep} />}

      {isComplete && (
        <Button w="full" size="lg" onClick={handlerRedirectToPoolPage} isLoading={!didRefetchPool}>
          Return to pool
        </Button>
      )}
    </VStack>
  )
}
