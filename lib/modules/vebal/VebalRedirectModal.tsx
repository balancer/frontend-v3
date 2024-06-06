import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  UnorderedList,
  ListItem,
  ModalFooter,
  Button,
  HStack,
  Link,
  useDisclosure,
  LinkProps,
} from '@chakra-ui/react'
import { ArrowUpRight } from 'react-feather'
import NextLink from 'next/link'

export function VeBalLink({ ...props }: LinkProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Link onClick={onOpen} variant="nav" color="font.primary" {...props}>
        veBAL
      </Link>

      <VebalRedirectModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export function VebalRedirectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
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
  )
}
