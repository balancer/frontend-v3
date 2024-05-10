/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { StakeForm } from '@/lib/modules/pool/actions/stake/StakeForm'
import { usePoolRedirect } from '@/lib/modules/pool/pool.hooks'
import { usePool } from '@/lib/modules/pool/usePool'
import { TransactionFlowProvider } from '@/lib/modules/transactions/transaction-steps/TransactionFlowProvider'
import { bn } from '@/lib/shared/utils/numbers'
import { useLayoutEffect } from 'react'

export default function StakePage() {
  const { pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  const hasBalance = bn(pool.userBalance?.walletBalance || '0').gt(0)

  const canStake = pool.staking && hasBalance

  useLayoutEffect(() => {
    if (!canStake) redirectToPoolPage()
  }, [])

  if (!canStake) return null

  return (
    <TransactionFlowProvider>
      <PoolActionsLayout>
        <StakeForm />
      </PoolActionsLayout>
    </TransactionFlowProvider>
  )
}
