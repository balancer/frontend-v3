'use client'
import { VStack } from '@chakra-ui/react'
import Link from 'next/link'

export default function Debug() {
  return (
    <VStack padding="lg" margin="lg">
      <Link href="/debug/approval">Relayer approval demo</Link>
      <Link href="/debug/join">Unbalanced join demo</Link>
      <Link href="/debug">Native asset (ETH) join demo (WIP)</Link>
      <Link href="/debug">Token approval demo (WIP)</Link>
    </VStack>
  )
}
