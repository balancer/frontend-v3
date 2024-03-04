import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  VStack,
} from '@chakra-ui/react'

import { useClaimStepConfigs } from '../../pool/actions/claim/useClaimStepConfigs'
import { PoolListItem } from '../../pool/pool.types'
import { useIterateSteps } from '../../pool/actions/useIterateSteps'

type Props = {
  isOpen: boolean
  onClose?(): void
  onOpen?(): void
  pools: PoolListItem[]
}

export function ClaimNetworkRewardsModal({
  isOpen,
  onClose,
  pools,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const stepConfigs = useClaimStepConfigs(pools)

  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontWeight="bold" size="h5">
            [{pools[0].chain}] Claim rewards
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {pools.map(pool => (
            <Stack key={pool.id}>
              <Heading size="sm">{pool.name}</Heading>
            </Stack>
          ))}
        </ModalBody>
        <ModalFooter>
          <VStack w="full">{currentStep.render(useOnStepCompleted)}</VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
