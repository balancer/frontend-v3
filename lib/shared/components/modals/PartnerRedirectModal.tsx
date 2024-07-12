/* eslint-disable max-len */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  Button,
  HStack,
  Image,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { ArrowUpRight } from 'react-feather'

export enum RedirectPartner {
  Aura = 'aura',
}

type Props = {
  partner: RedirectPartner
  redirectUrl?: string
  isOpen: boolean
  onClose: () => void
}

type PartnerInfo = {
  [key in RedirectPartner]: {
    shortName: string
    fullName: string
    description: string
    url: string
    imageSrc: string
  }
}

const partnerInfo: PartnerInfo = {
  [RedirectPartner.Aura]: {
    shortName: 'Aura',
    fullName: 'Aura Finance',
    description:
      "Aura Finance is a protocol built on top of the Balancer protocol to provide maximum incentives to Balancer liquidity providers and BAL stakers (into veBAL) through social aggregation of BAL deposits and via additional incentives of Aura's native token.",
    url: 'https://app.aura.finance',
    imageSrc: '/images/partners/aura-header.jpeg',
  },
}

export function PartnerRedirectModal({ partner, redirectUrl, isOpen, onClose }: Props) {
  const info = partnerInfo[partner]

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>About {info.shortName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody color="grayText">
          <Image
            src={info.imageSrc}
            alt={info.shortName}
            mb={4}
            shadow="md"
            borderRadius="lg"
            w="full"
          />
          <VStack align="start" w="full" spacing="lg">
            <VStack align="start" w="full" spacing="none">
              <Text fontSize="xl">{info.fullName}</Text>
              <Text color="grayText">{info.url}</Text>
            </VStack>

            <Text>{info.description}</Text>
            <Text>
              Please note, you face additional risks (including smart contract risk) when
              interacting with third party services.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            as={NextLink}
            href={redirectUrl ?? info.url}
            target="_blank"
            variant="primary"
            w="full"
          >
            <HStack>
              <span>Go to {info.shortName}</span>
              <ArrowUpRight size={16} />
            </HStack>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
