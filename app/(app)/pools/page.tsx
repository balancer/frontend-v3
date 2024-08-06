import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'

import { Box, Skeleton } from '@chakra-ui/react'
import { Suspense } from 'react'
import { CowPromolBanner } from './cow/CowPromoBanner'

export default async function PoolsPage() {
  return (
    <DefaultPageContainer>
      <FadeInOnView animateOnce={false}>
        <Box mb={{ base: '2xl', sm: '3xl' }}>
          <CowPromolBanner />
        </Box>
      </FadeInOnView>
      <FadeInOnView animateOnce={false}>
        <Suspense fallback={<Skeleton w="full" h="500px" />}>
          <PoolList />
        </Suspense>
      </FadeInOnView>
    </DefaultPageContainer>
  )
}
