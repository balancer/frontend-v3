import { FeaturedPools } from '@/lib/modules/featured-pools/FeaturedPools'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Skeleton } from '@chakra-ui/react'
import { Suspense } from 'react'

export default async function Pools() {
  return (
    <>
      <FeaturedPools mb="2xl" />
      <Suspense fallback={<Skeleton w="full" h="500px" />}>
        <PoolList />
      </Suspense>
    </>
  )
}
