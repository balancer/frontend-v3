'use client'
import Link from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { HStack } from '@chakra-ui/react'

export function Navbar() {
  return (
    <HStack padding="md">
      <Link href="/">Pools</Link>
      <DarkModeToggle />
      <ConnectButton />
    </HStack>
  )
}
