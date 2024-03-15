import { VStack } from '@chakra-ui/react'
import { PropsWithChildren, Suspense } from 'react'
import { FeaturedPoolsWrapper } from '@/app/(app)/pools/(list)/_components/FeaturedPoolsWrapper'

export default function PoolListLayout({ children }: PropsWithChildren) {
  return (
    <VStack align="start" spacing="2xl">
      <Suspense>
        <FeaturedPoolsWrapper />
      </Suspense>
      {children}
    </VStack>
  )
}
