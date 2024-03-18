import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Suspense } from 'react'

export default async function Pools() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PoolList />
    </Suspense>
  )
}
