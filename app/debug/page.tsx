'use client'
import { TransactionToasts } from './TransactionToast'
import { WriteContractExample } from './WriteContractExample'
import { RecentTransactionsProvider } from '@/lib/modules/transactions/RecentTransactionsProvider'

export default function DebugPage() {
  return (
    <RecentTransactionsProvider>
      <WriteContractExample></WriteContractExample>
      <TransactionToasts></TransactionToasts>
    </RecentTransactionsProvider>
  )
}
