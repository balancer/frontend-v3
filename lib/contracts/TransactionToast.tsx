'use client'

import { useToast } from '@chakra-ui/react'
import { useTransactions } from '../modules/web3/TransactionsProvider'
import { last } from 'lodash'
import { useEffect } from 'react'
import { TransactionInfo, getHash } from './useGualisWriteContract'

export function TransactionToasts() {
  const toast = useToast()

  const { transactions } = useTransactions()

  console.log('TOASTER:', transactions.length)

  const showToast = (transactionInfo?: TransactionInfo) => {
    if (!transactionInfo) return
    toast({
      title: 'Transaction',
      description: getHash(transactionInfo),
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  useEffect(() => {
    //usePrevious or some kind of subscription mechanism to react to state changes
    // Example:
    // onTxSuccess
    // onTxFail
    showToast(last(transactions))
  }, [transactions])

  return <>Transaction#: {transactions.length}</>
}
