import { PoolDetail } from '@/lib/modules/pool/PoolDetail/PoolDetailNew'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'

export default async function PoolPage() {
  return (
    <TransactionStateProvider>
      <PoolDetail isLoading={false} />
    </TransactionStateProvider>
  )
}
