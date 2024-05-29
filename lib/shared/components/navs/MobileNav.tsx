import { useDisclosure } from '@chakra-ui/hooks'
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  VStack,
  Link,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { Menu } from 'react-feather'
import { BalancerLogoType } from '../imgs/BalancerLogoType'
import { useNav } from './useNav'
import NextLink from 'next/link'

function NavLinks() {
  const { appLinks, linkColorFor } = useNav()

  return (
    <VStack align="start" w="full">
      {appLinks.map(link => (
        <Link
          key={link.href}
          as={NextLink}
          href={link.href}
          prefetch={true}
          variant="nav"
          color={linkColorFor(link.href)}
        >
          {link.label}
        </Link>
      ))}
    </VStack>
  )
}

export function MobileNav() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)

  return (
    <>
      <Button ref={btnRef} variant="tertiary" onClick={onOpen}>
        <Menu size={18} />
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <BalancerLogoType width="106px" />
          </DrawerHeader>

          <DrawerBody>
            <NavLinks />
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
