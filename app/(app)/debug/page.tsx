'use client'
import { Heading, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'

export default function Debug() {
  return (
    <VStack padding="lg" margin="lg">
      <Heading size="md">Demos</Heading>
      {/* <Link href="/debug/relayer-approval">Relayer approval</Link>
      <Link href="/debug/native-asset">Native asset (ETH) join</Link> */}
      <Link as={NextLink} href="/debug/token-approval" color="blue">
        Join with token approval
      </Link>
    </VStack>
  )
}
