'use client'

import NextLink from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { Box, Stack, HStack, BoxProps, Link } from '@chakra-ui/react'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { BalancerLogo } from '../imgs/BalancerLogo'
import { BalancerLogoType } from '../imgs/BalancerLogoType'
import { useBreakpoints } from '../../hooks/useBreakpoints'
import { UserSettings } from '@/lib/modules/user/settings/UserSettings'
import RecentTransactions from '../other/RecentTransactions'
import { usePathname } from 'next/navigation'

type Props = {
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
}

export function Navbar({ leftSlot, rightSlot, ...rest }: Props & BoxProps) {
  const { isMobile } = useBreakpoints()
  const pathname = usePathname()

  function linkColorFor(path: string) {
    return pathname === path ? 'font.highlight' : 'font.primary'
  }

  return (
    <Box w="full" {...rest}>
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
        <HStack padding="md" spacing="lg" color="font.primary" onClick={e => e.stopPropagation()}>
          {leftSlot || (
            <>
              <Link as={NextLink} variant="nav" href="/" prefetch={true}>
                <Box display="flex" gap="1.5">
                  {isMobile ? <BalancerLogo width="24px" /> : <BalancerLogoType width="106px" />}
                </Box>
              </Link>
              <Link
                as={NextLink}
                href="/pools"
                prefetch={true}
                variant="nav"
                color={linkColorFor('/pools')}
              >
                Pools
              </Link>
              <Link
                as={NextLink}
                variant="nav"
                href="/swap"
                prefetch={true}
                color={linkColorFor('/swap')}
              >
                Swap
              </Link>
              <Link
                as={NextLink}
                variant="nav"
                href="/portfolio"
                prefetch={true}
                color={linkColorFor('/portfolio')}
              >
                Portfolio
              </Link>
              <Link
                as={NextLink}
                variant="nav"
                href="/debug"
                prefetch={true}
                color={linkColorFor('/debug')}
              >
                Debug
              </Link>
            </>
          )}
        </HStack>
      </Stack>
    </Box>
  )
}
