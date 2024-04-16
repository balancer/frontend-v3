'use client'

import { Button, Center, Heading, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'

export default function Home() {
  return (
    <FadeInOnView>
      <Center>
        <VStack spacing="lg">
          <Heading size="2xl" variant="special">
            Balancer V3
          </Heading>
          <Button size="lg" as={Link} href="/pools" prefetch={true} variant="primary">
            Explore pools
          </Button>
        </VStack>
      </Center>
    </FadeInOnView>
  )
}
