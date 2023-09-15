'use client'
import Link from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { HStack } from '@chakra-ui/react'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'

export function Navbar() {
  return (
    <HStack padding="md">
      <Link href="/">Pools</Link>
      <DarkModeToggle />
      <ConnectWallet />
    </HStack>
  )
}
