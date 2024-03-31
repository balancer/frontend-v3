import { FeaturedPools } from '@/lib/modules/featured-pools/FeaturedPools'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Skeleton } from '@chakra-ui/react'
import { Suspense } from 'react'

export default async function Pools() {
  return (
    <>
      <Box mb="2xl">
        <FeaturedPools />
      </Box>
      <Suspense fallback={<div>Loading...</div>}>
        <Box>
          <PoolList />
        </Box>
      </Suspense>
    </>
  )
}
