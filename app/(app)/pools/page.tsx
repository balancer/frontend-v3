import { FeaturedPools } from '@/lib/modules/featured-pools/FeaturedPools'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Suspense } from 'react'

export default async function Pools() {
  return (
    <>
      <FeaturedPools mb="2xl" />
      <Suspense fallback={<div>Loading...</div>}>
        <PoolList />
      </Suspense>
    </>
  )
}
