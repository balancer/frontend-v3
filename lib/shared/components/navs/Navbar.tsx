'use client'

import NextLink from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { Box, HStack, BoxProps, Link, useDisclosure } from '@chakra-ui/react'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { BalancerLogo } from '../imgs/BalancerLogo'
import { BalancerLogoType } from '../imgs/BalancerLogoType'
import { UserSettings } from '@/lib/modules/user/settings/UserSettings'
import RecentTransactions from '../other/RecentTransactions'
import { isProd } from '@/lib/config/app.config'
import { staggeredFadeIn, fadeIn } from '@/lib/shared/utils/animations'
import { motion } from 'framer-motion'
import { VebalRedirectModal } from '@/lib/modules/vebal/VebalRedirectModal'
import { MobileNav } from './MobileNav'
import { useNav } from './useNav'

type Props = {
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
}

function VeBalLink() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Link onClick={onOpen} variant="nav" color="font.primary">
        veBAL
      </Link>

      <VebalRedirectModal isOpen={isOpen} onClose={onClose} />
    </>
  )
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
  return (
    <>
      <Box as={motion.div} variants={fadeIn} display={{ base: 'none', lg: 'block' }}>
        <RecentTransactions />
      </Box>
      <Box as={motion.div} variants={fadeIn} display={{ base: 'none', lg: 'block' }}>
        <UserSettings />
      </Box>
      <Box as={motion.div} variants={fadeIn} display={{ base: 'none', lg: 'block' }}>
        <DarkModeToggle />
      </Box>
      <Box as={motion.div} variants={fadeIn}>
        <ConnectWallet />
      </Box>
      <Box as={motion.div} variants={fadeIn} display={{ base: 'block', lg: 'none' }}>
        <MobileNav />
      </Box>
    </>
  )
}

export function Navbar({ leftSlot, rightSlot, ...rest }: Props & BoxProps) {
  return (
    <Box w="full" {...rest}>
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
