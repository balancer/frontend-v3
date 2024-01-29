/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { VStack } from '@chakra-ui/react'
import { useUnstaking } from './useUnstaking'
import { usePoolRedirect } from '../../pool.hooks'
import { usePool } from '../../usePool'
import React, { useState } from 'react'

export function UnstakeFlowButton() {
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const { steps } = useUnstaking()
  const { pool, refetch } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  async function handleUnstakeCompleted() {
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
        onComplete={handleUnstakeCompleted}
        onCompleteClick={handlerRedirectToPoolPage}
        completedButtonLabel="Return to pool"
        steps={steps}
      />
    </VStack>
  )
}
