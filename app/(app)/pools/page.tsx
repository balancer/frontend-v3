import { VStack } from '@chakra-ui/react'
import { Suspense } from 'react'
import { FeaturedPoolsWrapper } from '@/app/(app)/pools/_components/FeaturedPoolsWrapper'
import PoolListWrapper from '@/app/(app)/pools/_components/PoolListWrapper'

export const revalidate = 30

interface Props {
  searchParams: {
    first?: string
    skip?: string
    orderBy?: string
    orderDirection?: string
    poolTypes?: string
    networks?: string
    textSearch?: string
    userAddress?: string
  }
}

export default async function Pools({ searchParams }: Props) {
  return (
    <VStack align="start" spacing="2xl">
      <Suspense>
        <FeaturedPoolsWrapper />
      </Suspense>
      <Suspense>
        <PoolListWrapper searchParams={searchParams} />
      </Suspense>
    </VStack>
  )
}
