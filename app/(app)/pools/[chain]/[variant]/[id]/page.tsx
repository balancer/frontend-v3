import { PoolDetail } from '@/lib/modules/pool/PoolDetail/PoolDetail'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'

export default async function PoolPage() {
  return (
    <TransactionStateProvider>
      <PoolDetail />
    </TransactionStateProvider>
  )
}
