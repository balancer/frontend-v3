/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { StakeForm } from '@/lib/modules/pool/actions/stake/StakeForm'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import { usePoolRedirect } from '@/lib/modules/pool/pool.hooks'
import { usePool } from '@/lib/modules/pool/usePool'
import { bn } from '@/lib/shared/utils/numbers'
import { useLayoutEffect } from 'react'
import { StakeProvider } from '@/lib/modules/pool/actions/stake/StakeProvider'

export default function StakePage() {
  const { pool, isLoadingOnchainUserBalances } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  const hasBalance = bn(pool.userBalance?.walletBalance || '0').gt(0)

  const canStake = pool.staking && hasBalance

  // This is redirecting because balance is zero before it's loaded
  // useLayoutEffect(() => {
  //   if (!isLoadingOnchainUserBalances && !canStake) redirectToPoolPage()
  // }, [])

  // if (!canStake) return null

  return (
    <TransactionStateProvider>
      <PoolActionsLayout>
        <StakeProvider>
          <StakeForm />
        </StakeProvider>
      </PoolActionsLayout>
    </TransactionStateProvider>
  )
}
