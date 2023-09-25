'use client'
import { TransactionToasts } from './TransactionToast'
import { WriteContractExample } from './WriteContractExample'
import { TransactionsProvider } from '@/lib/modules/transactions/TransactionsProvider'

// export default function DebugPage() {
//   return <WriteExampleFive></WriteExampleFive>
// }
export default function DebugPage() {
  return (
    <TransactionsProvider>
      <WriteContractExample></WriteContractExample>
      <TransactionToasts></TransactionToasts>
    </TransactionsProvider>
  )
}
