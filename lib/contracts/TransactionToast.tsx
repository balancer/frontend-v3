'use client'

import { useToast, Button } from '@chakra-ui/react'
import { useTransactions } from '../modules/web3/TransactionsProvider'
import { last } from 'lodash'
import { TransactionInfo, getHash } from './useGualisWriteContract'


/**
 *
 * Example to illustrate how to show transaction related toasts in a decoupled way
 */
export function TransactionToasts() {
  const toast = useToast()

  const { transactions } = useTransactions()

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

  return <>
    Transaction#: {transactions.length}
    <Button onClick={() => showToast(last(transactions))}>Show last transaction</Button>
  </>
}
