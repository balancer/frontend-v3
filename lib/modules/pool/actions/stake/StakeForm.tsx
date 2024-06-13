'use client'

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  Tooltip,
  useDisclosure,
  Box,
} from '@chakra-ui/react'
import { useStake } from './StakeProvider'
import { useRef } from 'react'
import { StakeModal } from './StakeModal'
import { StakePreview } from './StakePreview'
import { usePoolRedirect } from '../../pool.hooks'

export function StakeForm() {
  const { isDisabled, disabledReason, isLoading, stakeTxHash, pool } = useStake()
  const nextBtn = useRef(null)
  const { onClose, onOpen, isOpen } = useDisclosure()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  const onModalClose = () => {
    if (stakeTxHash) {
      redirectToPoolPage()
    } else {
      onClose()
    }
  }

  return (
    <Box h="full" w="full" maxW="lg" mx="auto">
      <Card>
        <CardHeader>Stake for rewards</CardHeader>
        <CardBody>
          <StakePreview />
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
      <StakeModal finalFocusRef={nextBtn} isOpen={isOpen} onOpen={onOpen} onClose={onModalClose} />
    </Box>
  )
}
