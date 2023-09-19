'use client'
import Link from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { HStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

export function Navbar() {
  const t = useTranslations('components.navBar')
  return (
    <HStack padding="md">
      <Link href="/">{t('link')}</Link>
      <DarkModeToggle />
      <ConnectButton />
    </HStack>
  )
}
