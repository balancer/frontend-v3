'use client'
import { Heading, VStack } from '@chakra-ui/react'
import Link from 'next/link'

export default function Debug() {
  return (
    <VStack padding="lg" margin="lg">
      <Heading size="md">Demos</Heading>
      <Link href="/debug/relayer-approval">Relayer approval</Link>
      <Link href="/debug/native-asset">Native asset (ETH) join</Link>
      <Link href="/debug/token-approval">Join with token approval</Link>
    </VStack>
  )
}
