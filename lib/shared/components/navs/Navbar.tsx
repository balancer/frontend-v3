'use client'
import Link from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { HStack } from '@chakra-ui/react'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'

export function Navbar() {
  return (
    <HStack padding="md">
      <Link href="/" prefetch={true}>
        Home
      </Link>
      <Link href="/pools" prefetch={true}>
        Pools
      </Link>
      <Link href="/debug" prefetch={true}>
        Debug
      </Link>
      <DarkModeToggle />
      <ConnectWallet />
    </HStack>
  )
}
