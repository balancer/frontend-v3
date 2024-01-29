/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useEffect, useState } from 'react'
import { usePool } from '../../usePool'
import { Button, VStack } from '@chakra-ui/react'
import { usePoolRedirect } from '../../pool.hooks'

export type Props = {
  addLiquidityStep: FlowStep
}

export function AddLiquidityStep({ addLiquidityStep }: Props) {
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const { refetch, pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  const isComplete = addLiquidityStep.isComplete()

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
      {!isComplete && <TransactionStepButton step={addLiquidityStep}></TransactionStepButton>}

      {isComplete && (
        <Button w="full" size="lg" onClick={handlerRedirectToPoolPage} isLoading={!didRefetchPool}>
          Return to pool
        </Button>
      )}
    </VStack>
  )
}
