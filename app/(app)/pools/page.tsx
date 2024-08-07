import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'

import { Box, Skeleton } from '@chakra-ui/react'
import { Suspense } from 'react'
import { CowPromolBanner } from './cow/CowPromoBanner'

export default async function PoolsPage() {
  return (
    <>
      <Box bg="background.level0" borderBottom="1px solid" borderColor="border.base">
        <DefaultPageContainer pt={['xl', '40px']} pb={['xl', '2xl']}>
          {/* <FadeInOnView animateOnce={false}>
            <Box>
              <FeaturedPools featuredPools={featuredPools} />
            </Box>
          </FadeInOnView> */}
          <FadeInOnView animateOnce={false}>
            <Box mb={{ base: '2xl', sm: '3xl' }}>
              <CowPromolBanner />
            </Box>
          </FadeInOnView>
        </DefaultPageContainer>
      </Box>

      <DefaultPageContainer pt={['lg', '54px']} pb={['xl', '2xl']} noVerticalPadding>
        <FadeInOnView animateOnce={false}>
          <Suspense fallback={<Skeleton w="full" h="500px" />}>
            <PoolList />
          </Suspense>
        </FadeInOnView>
      </DefaultPageContainer>
    </>
  )
}
