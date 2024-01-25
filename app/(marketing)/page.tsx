'use client'

import { Button, Center, Heading, VStack } from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <Center>
      <VStack spacing="lg">
        <Heading size="2xl" variant="special">
          Balancer V3
        </Heading>
        <Button size="lg" as={Link} href="/pools" prefetch={true}>
          Explore pools
        </Button>
      </VStack>
    </Center>
  )
}
