'use client'

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  Button,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { useStake } from './StakeProvider'
import { useRef } from 'react'
import { StakeModal } from './StakeModal'
import { StakePreview } from './StakePreview'

export function StakeForm() {
  const { isDisabled, disabledReason, isLoading, stakableBalance, stakableBalanceUsd } = useStake()
  const nextBtn = useRef(null)
  const { onClose, onOpen, isOpen } = useDisclosure()

  return (
    <Center h="full" w="full" maxW="lg" mx="auto">
      <Card>
        <CardHeader>
          <Heading fontWeight="bold" size="h5">
            Stake
          </Heading>
        </CardHeader>
        <CardBody>
          <StakePreview stakableBalance={stakableBalance} stakableBalanceUsd={stakableBalanceUsd} />
        </CardBody>
        <CardFooter>
          <Tooltip label={isDisabled ? disabledReason : ''}>
            <Button
              ref={nextBtn}
              variant="secondary"
              w="full"
              size="lg"
              isDisabled={isDisabled}
              isLoading={isLoading}
              onClick={() => !isDisabled && onOpen()}
            >
              Next
            </Button>
          </Tooltip>
        </CardFooter>
      </Card>
      <StakeModal finalFocusRef={nextBtn} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Center>
  )
}
