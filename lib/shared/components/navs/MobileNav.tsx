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
import { useRouter } from 'next/navigation'

function NavLinks({ onClick }: { onClick?: () => void }) {
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
          onClick={onClick}
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
  const router = useRouter()

  function hommRedirect() {
    onClose()
    router.push('/')
  }

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
            <BalancerLogoType width="106px" onClick={hommRedirect} />
          </DrawerHeader>

          <DrawerBody>
            <NavLinks onClick={onClose} />
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
