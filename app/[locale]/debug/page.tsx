'use client'
import { TransactionToasts } from './TransactionToast'
import { JoinExample } from './JoinExample'
import { RecentTransactionsProvider } from '@/lib/modules/transactions/RecentTransactionsProvider'

export default function DebugPage() {
  return (
    <RecentTransactionsProvider>
      <JoinExample></JoinExample>
      <TransactionToasts></TransactionToasts>
    </RecentTransactionsProvider>
  )
}
