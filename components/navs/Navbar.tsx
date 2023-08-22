'use client'
import Link from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { HStack } from '@chakra-ui/react'
import { Connect } from './Connect'

export function Navbar() {
  return (
    <HStack padding="md">
      <Link href="/">Pools</Link>
      <DarkModeToggle />
      <Connect />
    </HStack>
  )
}
