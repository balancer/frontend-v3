import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { GqlPoolType } from '@/lib/shared/services/api/generated/graphql'
import { Skeleton } from '@chakra-ui/react'
import { Suspense } from 'react'
import { CowBanner } from './CowBanner'
import { Metadata } from 'next'
import { CowFooter } from './CowFooter'
import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'

export const metadata: Metadata = {
  title: `CoWAMM DeFi Liquidity Pools`,
  description: `
    Explore DeFi liquidity pools or create your own.
    Provide liquidity to accumulate yield from swap fees
    while retaining your token exposure as prices move.
  `,
}

export default function PoolsPage() {
  return (
    <>
      <DefaultPageContainer>
        <CowBanner />
        <FadeInOnView animateOnce={false}>
          <Suspense fallback={<Skeleton w="full" h="500px" />}>
            <PoolList fixedPoolTypes={[GqlPoolType.CowAmm]} />
          </Suspense>
        </FadeInOnView>
      </DefaultPageContainer>

      <CowFooter />
    </>
  )
}
