import {
  Center,
  Heading,
  Text,
  Flex,
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import Section from '@/lib/shared/components/layout/Section'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { Picture } from '../../../other/Picture'
import { ArrowUpRight } from 'react-feather'
import NextLink from 'next/link'
import { useState } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  useCase: UseCase
}

enum UseCase {
  BoostedPools = 'boosted-pools',
  Stablesurge = 'stablesurge',
  LVRMitigation = 'lvr-mitigation',
}

type UseCaseInfo = {
  [key in UseCase]: {
    title: string
    description: string
    url: string
  }
}

const useCaseInfo: UseCaseInfo = {
  [UseCase.BoostedPools]: {
    title: '100% Boosted Pools',
    description:
      'Balancer v3 introduces 100% boosted pools, which allow liquidity providers to earn more fees and BAL rewards.',
    url: 'https://balancer.finance',
  },
  [UseCase.Stablesurge]: {
    title: 'Stablesurge hooks',
    description:
      'Balancer v3 introduces stablesurge hooks, which allow liquidity providers to earn more fees and BAL rewards.',
    url: 'https://balancer.finance',
  },
  [UseCase.LVRMitigation]: {
    title: 'LVR mitigation',
    description:
      'Balancer v3 introduces LVR mitigation, which allows liquidity providers to earn more fees and BAL rewards.',
    url: 'https://balancer.finance',
  },
}

function UseCaseModal({ useCase, isOpen, onClose }: ModalProps) {
  const info = useCaseInfo[useCase]

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{info.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody color="grayText">
          <Text>{info.description}</Text>
        </ModalBody>

        <ModalFooter>
          <HStack w="full">
            <Button as={NextLink} href={info.url} target="_blank" variant="primary" w="full">
              <HStack>
                <span>View in v3 docs</span>
                <ArrowUpRight size={16} />
              </HStack>
            </Button>
            <Button variant="tertiary" w="full" onClick={onClose}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export function V3UseCases() {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase>(UseCase.BoostedPools)

  const modalDisclosure = useDisclosure()

  function openModal(useCase: UseCase) {
    setSelectedUseCase(useCase)
    modalDisclosure.onOpen()
  }

  return (
    <Section className="use-cases">
      <Box maxW="maxContent" m="0 auto" px={{ base: 'md', xl: '0' }}>
        <Box
          pb={{ base: 'md', md: 'lg' }}
          w="full"
          maxW="6xl"
          m="auto"
          textAlign={{ base: 'left', md: 'center' }}
        >
          <FadeInOnView>
            <Text pb="lg" variant="eyebrow" w="full">
              Use cases
            </Text>
            <Heading
              pb="md"
              w="full"
              as="h2"
              size="2xl"
              sx={{
                textWrap: 'balance',
              }}
            >
              Flexible design space for AMMs
            </Heading>
            <Text
              pb="lg"
              maxW="4xl"
              m="auto"
              sx={{
                textWrap: 'balance',
              }}
            >
              v3 enables the next wave of DeFi products to come to market. Learn about the new types
              of things that can be built on Balancer v3.
            </Text>
          </FadeInOnView>
          <FadeInOnView>
            <Flex gap="lg" pt={{ base: '0', md: 'md' }}>
              <Box
                position="relative"
                rounded="full"
                cursor="pointer"
                onClick={() => openModal(UseCase.BoostedPools)}
              >
                <Center>
                  <Box className="enso">
                    <Picture
                      imgName="use-case-1"
                      altText="100% boosted pools"
                      defaultImgType="png"
                      directory="/images/v3/"
                      imgPngDark={true}
                      imgPng={true}
                    />
                  </Box>

                  <Box
                    textAlign="center"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%,-50%)"
                    zIndex="10"
                    width="full"
                    padding="md"
                  >
                    <Box>
                      <Text
                        fontWeight="bold"
                        color="white"
                        position="relative"
                        top={{ base: '0', md: '0' }}
                      >
                        100% Boosted Pools
                      </Text>
                    </Box>
                  </Box>
                </Center>
              </Box>
              <Box
                position="relative"
                rounded="full"
                cursor="pointer"
                onClick={() => openModal(UseCase.Stablesurge)}
              >
                <Center>
                  <Box className="enso">
                    <Picture
                      imgName="use-case-2"
                      altText="100% boosted pools"
                      defaultImgType="png"
                      directory="/images/v3/"
                      imgPngDark={true}
                      imgPng={true}
                    />
                  </Box>

                  <Box
                    textAlign="center"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%,-50%)"
                    zIndex="10"
                    width="full"
                    padding="md"
                  >
                    <Box>
                      <Text
                        fontWeight="bold"
                        color="white"
                        position="relative"
                        top={{ base: '0', md: '0' }}
                      >
                        Stablesurge hooks
                      </Text>
                    </Box>
                  </Box>
                </Center>
              </Box>

              <Box
                position="relative"
                rounded="full"
                cursor="pointer"
                onClick={() => openModal(UseCase.LVRMitigation)}
              >
                <Center>
                  <Box className="enso">
                    <Picture
                      imgName="use-case-3"
                      altText="100% boosted pools"
                      defaultImgType="png"
                      directory="/images/v3/"
                      imgPngDark={true}
                      imgPng={true}
                    />
                  </Box>

                  <Box
                    textAlign="center"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%,-50%)"
                    zIndex="10"
                    width="full"
                    padding="md"
                  >
                    <Box>
                      <Text
                        fontWeight="bold"
                        color="white"
                        position="relative"
                        top={{ base: '0', md: '0' }}
                      >
                        LVR mitigation
                      </Text>
                    </Box>
                  </Box>
                </Center>
              </Box>
            </Flex>
          </FadeInOnView>
        </Box>
      </Box>
      <UseCaseModal
        isOpen={modalDisclosure.isOpen}
        onClose={modalDisclosure.onClose}
        useCase={selectedUseCase}
      />
    </Section>
  )
}
