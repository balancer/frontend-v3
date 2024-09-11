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
  Divider,
  Box,
  Text,
  HStack,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { ArrowUpRight, Menu } from 'react-feather'
import { BalancerLogoType } from '../imgs/BalancerLogoType'
import { useNav } from './useNav'
import { useRouter } from 'next/navigation'
import { VeBalLink } from '@/lib/modules/vebal/VebalRedirectModal'
import { getGqlChain } from '@/lib/config/app.config'
import { Feature } from '@/lib/config/config.types'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { hasFeature } from '@/lib/config/hasFeature'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'

function NavLinks({ onClick }: { onClick?: () => void }) {
  const { projectExtraAppLinks, ProjectAppLinks } = useNav()
  const { chain: _chain } = useUserAccount()
  const { defaultNetwork, features } = getProjectConfig()

  const chain = _chain?.id ? getGqlChain(_chain?.id) : defaultNetwork
  const projectLinks = projectExtraAppLinks(onClick)
  const projectFeature = features ? features[chain] : []

  return (
    <VStack align="start" w="full">
      <ProjectAppLinks onClick={onClick} />
      {hasFeature(chain, Feature.vebal) && <VeBalLink fontSize="xl" />}
      {projectFeature &&
        projectFeature.map(
          feature =>
            projectLinks.find(link => (link.label.toLowerCase() as Feature) === feature)?.component
        )}
    </VStack>
  )
}

function EcosystemLinks() {
  const { ecoSystemLinks } = useNav()

  return (
    <VStack align="start" w="full">
      <Text color="grayText" size="xs" mb="sm">
        Ecosystem
      </Text>
      {ecoSystemLinks.map(link => (
        <Link
          key={link.href}
          href={link.href}
          variant="nav"
          isExternal
          display="flex"
          alignItems="center"
          gap="xs"
        >
          {link.label}
          <Box color="grayText">
            <ArrowUpRight size={14} />
          </Box>
        </Link>
      ))}
    </VStack>
  )
}

function SocialLinks() {
  const { getSocialLinks } = useNav()

  return (
    <HStack justify="space-between" w="full">
      {getSocialLinks().map(({ href, icon }) => (
        <Button as={Link} key={href} href={href} variant="tertiary" isExternal>
          {icon}
        </Button>
      ))}
    </HStack>
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
            <Divider my={4} />
            <EcosystemLinks />
          </DrawerBody>

          <DrawerFooter>
            <SocialLinks />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
