/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { useEffect, useState } from 'react'
import { usePool } from '../../usePool'
import { Button, VStack } from '@chakra-ui/react'
import { usePoolRedirect } from '../../pool.hooks'
import { useConstructClaimAndUnstakeStep } from './useConstructClaimAndUnstakeStep'

export function ClaimAndUnstakeButton() {
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const { refetch, pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  const { claimAndUnstakeStep } = useConstructClaimAndUnstakeStep()

  const isComplete = claimAndUnstakeStep.isComplete()

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
        <TransactionStepButton step={claimAndUnstakeStep} />
      )}
    </VStack>
  )
}
