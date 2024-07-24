import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { GqlPoolType } from '@/lib/shared/services/api/generated/graphql'
import { Skeleton } from '@chakra-ui/react'
import { Suspense } from 'react'
import { CowBanner } from './CowBanner'

export default function PoolsPage() {
  return (
    <>
      <CowBanner />
      <FadeInOnView animateOnce={false}>
        <Suspense fallback={<Skeleton w="full" h="500px" />}>
          <PoolList fixedPoolTypes={[GqlPoolType.CowAmm]} />
        </Suspense>
      </FadeInOnView>
    </>
  )
}
