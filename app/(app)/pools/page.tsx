import { FeaturedPools } from '@/lib/modules/featured-pools/FeaturedPools'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Box, Skeleton } from '@chakra-ui/react'
import { Suspense } from 'react'

export default async function Pools() {
  return (
    <>
      <Box mb="2xl">
        <FeaturedPools />
      </Box>
      <Suspense fallback={<Skeleton w="full" h="500px" />}>
        <Box>
          <PoolList />
        </Box>
      </Suspense>
    </>
  )
}
