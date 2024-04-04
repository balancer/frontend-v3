'use client'

import NextLink from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import {
  Box,
  Stack,
  HStack,
  BoxProps,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
  useDisclosure,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { BalancerLogo } from '../imgs/BalancerLogo'
import { BalancerLogoType } from '../imgs/BalancerLogoType'
import { useBreakpoints } from '../../hooks/useBreakpoints'
import { UserSettings } from '@/lib/modules/user/settings/UserSettings'
import RecentTransactions from '../other/RecentTransactions'
import { usePathname } from 'next/navigation'
import { isProd } from '@/lib/config/app.config'
import { ArrowUpRight } from 'react-feather'

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

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>veBAL (redirect to v2)</ModalHeader>
          <ModalCloseButton />
          <ModalBody color="grayText">
            The veBAL experience is being carefully crafted for this new app. In the meantime, go to
            the v2 app to nurture your veBAL:
            <UnorderedList>
              <ListItem>Vote on gauges</ListItem>
              <ListItem>Lock and unlock veBAL</ListItem>
              <ListItem>View your balance and expiry date</ListItem>
              <ListItem>Sync veBAL to other networks</ListItem>
            </UnorderedList>
          </ModalBody>

          <ModalFooter>
            <Button
              as={NextLink}
              href="https://app.balancer.fi/#/ethereum/vebal"
              target="_blank"
              variant="primary"
              w="full"
            >
              <HStack>
                <span>Proceed to V2</span>
                <ArrowUpRight size={16} />
              </HStack>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
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
        <HStack p={['ms', 'md']} order={{ md: '2' }} onClick={e => e.stopPropagation()}>
          {rightSlot || (
            <>
              <RecentTransactions />
              <UserSettings />
              <DarkModeToggle />
              <ConnectWallet />
            </>
          )}
        </HStack>
        <HStack
          p={['ms', 'md']}
          spacing="lg"
          color="font.primary"
          onClick={e => e.stopPropagation()}
          gap={['md', 'lg']}
        >
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
              <VeBalLink />
              {!isProd && (
                <Link
                  as={NextLink}
                  variant="nav"
                  href="/debug"
                  prefetch={true}
                  color={linkColorFor('/debug')}
                >
                  Debug
                </Link>
              )}
            </>
          )}
        </HStack>
      </Stack>
    </Box>
  )
}
