import { FeaturedPools } from '@/lib/modules/featuredPools/FeaturedPools'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Suspense } from 'react'

export default async function Pools() {
  return (
    <>
      <FeaturedPools mb="xl" />
      <Suspense fallback={<div>Loading...</div>}>
        <PoolList />
      </Suspense>
    </>
  )
}
