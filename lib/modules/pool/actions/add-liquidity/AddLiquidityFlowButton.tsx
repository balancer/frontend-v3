'use client'

import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { Text, VStack } from '@chakra-ui/react'
import { useAddLiquidity } from './useAddLiquidity'
import { usePoolRedirect } from '../../pool.hooks'
import { usePool } from '../../usePool'
import React, { useState } from 'react'

export function AddLiquidityFlowButton() {
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const { initialAmountsToApprove, steps } = useAddLiquidity()
  const { pool, refetch } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  async function handleJoinCompleted() {
    await refetch() // Refetches onchain balances.
    setDidRefetchPool(true)
  }

  async function handlerRedirectToPoolPage(event: React.MouseEvent<HTMLElement>) {
    if (!didRefetchPool) await refetch() // Refetches onchain balances.
    redirectToPoolPage(event)
  }

  const tokensRequiringApprovalTransaction = initialAmountsToApprove
    ?.map(token => token.tokenSymbol)
    .join(', ')

  return (
    <VStack w="full">
      <Text variant="specialSecondary">
        {tokensRequiringApprovalTransaction
          ? `Tokens that require approval step: ${tokensRequiringApprovalTransaction}`
          : 'All tokens have enough allowance'}
      </Text>
      <TransactionFlow
        onComplete={handleJoinCompleted}
        onCompleteClick={handlerRedirectToPoolPage}
        completedButtonLabel="Return to pool"
        steps={steps}
      />
    </VStack>
  )
}
