'use client'
import Link from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { HStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'

export function Navbar() {
  const t = useTranslations('Navbar')
  return (
    <HStack padding="md">
      <Link href="/">{t('link')}</Link>
      <DarkModeToggle />
      <ConnectWallet />
    </HStack>
  )
}
