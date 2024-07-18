'use client'

import NextLink from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { Box, HStack, BoxProps, Link, Button } from '@chakra-ui/react'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { BalancerLogo } from '../imgs/BalancerLogo'
import { BalancerLogoType } from '../imgs/BalancerLogoType'
import { UserSettings } from '@/lib/modules/user/settings/UserSettings'
import RecentTransactions from '../other/RecentTransactions'
import { isProd } from '@/lib/config/app.config'
import { staggeredFadeIn, fadeIn } from '@/lib/shared/utils/animations'
import { motion } from 'framer-motion'
import { VeBalLink } from '@/lib/modules/vebal/VebalRedirectModal'
import { MobileNav } from './MobileNav'
import { useNav } from './useNav'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

type Props = {
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
}

function NavLinks({ ...props }: BoxProps) {
  const { appLinks, linkColorFor } = useNav()

  return (
    <HStack spacing="lg" fontWeight="medium" {...props}>
      {appLinks.map(link => (
        <Box key={link.href} as={motion.div} variants={fadeIn}>
          <Link
            as={NextLink}
            href={link.href}
            prefetch={true}
            variant="nav"
            color={linkColorFor(link.href)}
          >
            {link.label}
          </Link>
        </Box>
      ))}
      <Box as={motion.div} variants={fadeIn}>
        <VeBalLink />
      </Box>
      {!isProd && (
        <Box as={motion.div} variants={fadeIn}>
          <Link
            as={NextLink}
            variant="nav"
            href="/debug"
            prefetch={true}
            color={linkColorFor('/debug')}
          >
            Debug
          </Link>
        </Box>
      )}
    </HStack>
  )
}

function NavLogo() {
  return (
    <Box as={motion.div} variants={fadeIn}>
      <Link as={NextLink} variant="nav" href="/" prefetch={true}>
        <Box>
          <Box display={{ base: 'block', md: 'none' }}>
            <BalancerLogo width="26px" />
          </Box>
          <Box display={{ base: 'none', md: 'block' }}>
            <BalancerLogoType width="106px" />
          </Box>
        </Box>
      </Link>
    </Box>
  )
}

function NavActions() {
  const pathname = usePathname()

  const actions = useMemo(() => {
    if (pathname === '/') {
      return [
        {
          el: <DarkModeToggle />,
          display: { base: 'none', lg: 'block' },
        },
        {
          el: (
            <Button size="md" px={7} as={NextLink} href="/pools" prefetch={true} variant="primary">
              Launch app
            </Button>
          ),
          display: { base: 'block', lg: 'block' },
        },
        {
          el: <MobileNav />,
          display: { base: 'block', lg: 'none' },
        },
      ]
    }

    return [
      {
        el: <RecentTransactions />,
        display: { base: 'none', lg: 'block' },
      },
      {
        el: <UserSettings />,
        display: { base: 'none', lg: 'block' },
      },
      {
        el: <DarkModeToggle />,
        display: { base: 'none', lg: 'block' },
      },
      {
        el: <ConnectWallet />,
        display: { base: 'block', lg: 'block' },
      },
      {
        el: <MobileNav />,
        display: { base: 'block', lg: 'none' },
      },
    ]
  }, [pathname])

  return (
    <>
      {actions.map(({ el, display }, i) => (
        <Box key={i} as={motion.div} variants={fadeIn} display={display}>
          {el}
        </Box>
      ))}
    </>
  )
}

export function Navbar({ leftSlot, rightSlot, ...rest }: Props & BoxProps) {
  return (
    <Box w="full" {...rest} background="background.level1">
      <HStack padding={{ base: 'sm', md: 'md' }} justify="space-between" as="nav">
        <HStack
          spacing="lg"
          onClick={e => e.stopPropagation()}
          as={motion.div}
          variants={staggeredFadeIn}
          initial="hidden"
          animate="show"
        >
          {leftSlot || (
            <>
              <NavLogo />
              <NavLinks display={{ base: 'none', lg: 'flex' }} />
            </>
          )}
        </HStack>
        <HStack
          order={{ md: '2' }}
          onClick={e => e.stopPropagation()}
          as={motion.div}
          variants={staggeredFadeIn}
          initial="hidden"
          animate="show"
        >
          {rightSlot || <NavActions />}
        </HStack>
      </HStack>
    </Box>
  )
}
