/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { Text, VStack } from '@chakra-ui/react'
import { useStaking } from './useStaking'
import { usePoolRedirect } from '../../pool.hooks'
import { usePool } from '../../usePool'
import React, { useState } from 'react'

export function StakeFlowButton() {
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const { steps, remainingAmountsToApprove } = useStaking()
  const { pool, refetch } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  async function handleStakeCompleted() {
    await refetch() // Refetches onchain balances.
    setDidRefetchPool(true)
  }

  async function handlerRedirectToPoolPage(event: React.MouseEvent<HTMLElement>) {
    if (!didRefetchPool) await refetch() // Refetches onchain balances.
    redirectToPoolPage(event)
  }

  const tokensRequiringApprovalTransaction = remainingAmountsToApprove?.map(
    token => token.tokenSymbol
  )

  return (
    <VStack w="full">
      <Text variant="specialSecondary">
        {tokensRequiringApprovalTransaction
          ? `BPT ${tokensRequiringApprovalTransaction} requires approval step`
          : 'BPT has enough allowance'}
      </Text>
      <TransactionFlow
        onComplete={handleStakeCompleted}
        onCompleteClick={handlerRedirectToPoolPage}
        completedButtonLabel="Return to pool"
        steps={steps}
      />
    </VStack>
  )
}
