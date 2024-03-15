'use client'
import Link from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { Box, Stack, HStack, BoxProps } from '@chakra-ui/react'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { BalancerLogo } from '../imgs/BalancerLogo'
import { BalancerLogoType } from '../imgs/BalancerLogoType'
import { useBreakpoints } from '../../hooks/useBreakpoints'
import { UserSettings } from '@/lib/modules/user/settings/UserSettings'
import RecentTransactions from '../other/RecentTransactions'
import { useTheme } from 'next-themes'

type Props = {
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
}

export function Navbar({ leftSlot, rightSlot, ...rest }: Props & BoxProps) {
  const { isMobile } = useBreakpoints()
  const { theme, setTheme } = useTheme()

  return (
    <Box w="full" {...rest}>
      <div>
        The current theme is: {theme}
        <button onClick={() => setTheme('light')}>Light Mode</button>
        <button onClick={() => setTheme('dark')}>Dark Mode</button>
      </div>
      <Stack
        flexDirection={{ base: 'column', md: 'row' }}
        justify={{ base: 'flex-start', md: 'space-between' }}
        fontWeight="medium"
        as="nav"
      >
        <HStack padding="md" order={{ md: '2' }} onClick={e => e.stopPropagation()}>
          {rightSlot || (
            <>
              <RecentTransactions />
              <UserSettings />
              <DarkModeToggle />
              <ConnectWallet />
            </>
          )}
        </HStack>
        <HStack padding="md" spacing="lg" onClick={e => e.stopPropagation()}>
          {leftSlot || (
            <>
              <Link href="/" prefetch={true}>
                <Box display="flex" gap="1.5">
                  {isMobile ? <BalancerLogo width="24px" /> : <BalancerLogoType width="106px" />}
                </Box>
              </Link>
              <Link href="/pools" prefetch={true}>
                Pools
              </Link>
              <Link href="/swap" prefetch={true}>
                Swap
              </Link>
              <Link href="/portfolio" prefetch={true}>
                Portfolio
              </Link>
              <Link href="/debug" prefetch={true}>
                Debug
              </Link>
            </>
          )}
        </HStack>
      </Stack>
    </Box>
  )
}
