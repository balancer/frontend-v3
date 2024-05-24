import { PoolListProvider } from '@/lib/modules/pool/PoolList/PoolListProvider'
import { PoolListLayout } from './PoolListLayout'

export async function PoolList() {
  return (
    <PoolListProvider>
      <PoolListLayout />
    </PoolListProvider>
  )
}
