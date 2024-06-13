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
import { usePoolRedirect } from '../../pool.hooks'

export function UnstakeForm() {
  const nextBtn = useRef(null)
  const { onClose, onOpen, isOpen } = useDisclosure()

  const { isDisabled, disabledReason, isLoading, unstakeTxHash, pool } = useUnstake()

  const { redirectToPoolPage } = usePoolRedirect(pool)

  const onModalClose = () => {
    if (unstakeTxHash) {
      redirectToPoolPage()
    } else {
      onClose()
    }
  }

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
      <UnstakeModal
        finalFocusRef={nextBtn}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onModalClose}
      />
    </Box>
  )
}
