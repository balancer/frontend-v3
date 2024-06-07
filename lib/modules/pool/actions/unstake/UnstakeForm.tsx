'use client'

import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { useUnstake } from './UnstakeProvider'
import { UnstakePreview } from './UnstakePreview'
import { UnstakeModal } from './UnstakeModal'

export function UnstakeForm() {
  const nextBtn = useRef(null)
  const { onClose, onOpen, isOpen } = useDisclosure()

  const { isDisabled, disabledReason, isLoading } = useUnstake()

  return (
    <Box h="full" w="full" maxW="lg" mx="auto">
      <Card>
        <CardHeader>Claim & Unstake</CardHeader>
        <CardBody>
          <UnstakePreview />
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
      <UnstakeModal finalFocusRef={nextBtn} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  )
}
