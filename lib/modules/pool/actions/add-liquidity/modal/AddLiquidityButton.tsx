/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { Button, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { usePoolRedirect } from '../../../pool.hooks'
import { usePool } from '../../../usePool'
import { useConstructAddLiquidityStep } from '../useConstructAddLiquidityStep'

export function AddLiquidityButton() {
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const { refetch, pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  const { addLiquidityStep } = useConstructAddLiquidityStep()

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
      {isComplete ? (
        <Button w="full" size="lg" onClick={handlerRedirectToPoolPage} isLoading={!didRefetchPool}>
          Return to pool
        </Button>
      ) : (
        // TODO: implement system to enforce that the new pool balance is loaded in the portfolio
        // <Button as={Link} w="full" size="lg" isLoading={!didRefetchPool} href="/portfolio">
        //   Visit portfolio
        // </Button>
        <TransactionStepButton step={addLiquidityStep} />
      )}
    </VStack>
  )
}
