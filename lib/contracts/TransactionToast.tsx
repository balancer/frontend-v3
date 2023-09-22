'use client'

import { useToast, Button } from '@chakra-ui/react'
import { useTransactions } from '../modules/web3/TransactionsProvider'

export function TransactionToasts() {
  // const toast = useToast()

  const { transactions } = useTransactions()

  // const showToast = () => {
  //   toast({
  //     title: 'Transaction',
  //     description: 'desc',
  //     status: 'success',
  //     duration: 2000,
  //     isClosable: true,
  //   })
  // }

  // useEffect(() => (transactions.length > 0 ? showToast() : noop), [transactions])

  return (
    <>
      Transactions #: {transactions.length}
      <br></br>
      {/* <Button onClick={showToast}>Show Toast</Button> */}
    </>
  )
}
