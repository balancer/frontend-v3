import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { VStack } from '@chakra-ui/react'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { useState } from 'react'
import { usePool } from '../../../usePool'
import { usePoolRedirect } from '../../../pool.hooks'

export function RemoveLiquidityFlowButton() {
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const { steps } = useRemoveLiquidity()
  const { pool, refetch } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  async function handleRemoveCompleted() {
    await refetch() // Refetches onchain balances.
    setDidRefetchPool(true)
  }

  async function handlerRedirectToPoolPage(event: React.MouseEvent<HTMLElement>) {
    if (!didRefetchPool) await refetch() // Refetches onchain balances.
    redirectToPoolPage(event)
  }

  return (
    <VStack w="full">
      <TransactionFlow
        onComplete={handleRemoveCompleted}
        onCompleteClick={handlerRedirectToPoolPage}
        completedButtonLabel="Return to pool"
        steps={steps}
      />
    </VStack>
  )
}
