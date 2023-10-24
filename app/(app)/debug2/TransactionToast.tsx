'use client'

import { TransactionBundle } from '@/lib/contracts/contract.types'
import { getHashFromTransaction } from '@/lib/contracts/wagmi-helpers'
import { useRecentTransactions } from '@/lib/modules/transactions/RecentTransactionsProvider'
import { useToast, Button } from '@chakra-ui/react'
import { last } from 'lodash'

/**
 *
 * Example to illustrate how to show transaction related toasts in a decoupled way
 */
export function TransactionToasts() {
  const toast = useToast()

  const { transactions } = useRecentTransactions()

  const showToast = (transactionBundle?: TransactionBundle) => {
    if (!transactionBundle) return
    toast({
      title: 'Transaction',
      description: getHashFromTransaction(transactionBundle),
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <>
      Transaction#: {transactions.length}
      <Button onClick={() => showToast(last(transactions))}>Show last transaction</Button>
    </>
  )
}
