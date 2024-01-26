/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { Text, VStack } from '@chakra-ui/react'
import { useAddLiquidity } from './useAddLiquidity'
import { usePoolRedirect } from '../../pool.hooks'
import { usePool } from '../../usePool'
import React, { useEffect, useState } from 'react'
import { TokenAmountToApprove } from '@/lib/modules/tokens/approvals/approval-rules'
import { useTokens } from '@/lib/modules/tokens/useTokens'

export function AddLiquidityFlowButton() {
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const [initialAmountsToApprove, setInitialAmountsToApprove] = useState<
    TokenAmountToApprove[] | null
  >(null)
  const { steps, remainingAmountsToApprove } = useAddLiquidity()
  const { pool, refetch } = usePool()
  const { getToken } = useTokens()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  useEffect(() => {
    // Saves the first value of remainingAmountsToApprove in case we want to show in the UI:
    // initial VS remaining token approvals
    if (initialAmountsToApprove === null) {
      setInitialAmountsToApprove(remainingAmountsToApprove)
    }
  }, [JSON.stringify(remainingAmountsToApprove)])

  async function handleJoinCompleted() {
    await refetch() // Refetches onchain balances.
    setDidRefetchPool(true)
  }

  async function handlerRedirectToPoolPage(event: React.MouseEvent<HTMLElement>) {
    if (!didRefetchPool) await refetch() // Refetches onchain balances.
    redirectToPoolPage(event)
  }

  const tokensRequiringApprovalTransaction = remainingAmountsToApprove
    ?.map(token => getToken(token.tokenAddress, pool.chain)?.symbol)
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
