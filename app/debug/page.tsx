'use client'
import { TransactionToasts } from '@/lib/contracts/TransactionToast'
import { WriteExampleFive } from '@/lib/contracts/writeExampleFive'
import { TransactionsProvider } from '@/lib/modules/web3/TransactionsProvider'

// export default function DebugPage() {
//   return <WriteExampleFive></WriteExampleFive>
// }
export default function DebugPage() {
  return (
    <TransactionsProvider>
      <WriteExampleFive></WriteExampleFive>
      <TransactionToasts></TransactionToasts>
    </TransactionsProvider>
  )
}
