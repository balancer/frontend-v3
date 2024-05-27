'use client'

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { usePool } from '../../PoolProvider'
import { useRef } from 'react'
import { useUnstake } from './UnstakeProvider'
import { UnstakePreview } from './UnstakePreview'
import { UnstakeModal } from './UnstakeModal'

export function UnstakeForm() {
  const { pool } = usePool()
  const nextBtn = useRef(null)
  const { onClose, onOpen, isOpen } = useDisclosure()

  const { rewardAmounts, totalClaimableUsd, isDisabled, disabledReason, isLoading } = useUnstake()

  return (
    <Center h="full" w="full" maxW="lg" mx="auto">
      <Card>
        <CardHeader>Claim & Unstake</CardHeader>
        <CardBody>
          <UnstakePreview
            stakedBalance={pool.userBalance?.stakedBalance || '0'}
            stakedBalanceUsd={pool.userBalance?.stakedBalanceUsd.toString() || '0'}
            rewardAmounts={rewardAmounts}
            totalClaimableUsd={totalClaimableUsd}
          />
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
    </Center>
  )
}
