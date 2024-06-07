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
import { useMigrateStake } from './MigrateStakeProvider'
import { MigrateStakePreview } from './MigrateStakePreview'
import { MigrateStakeModal } from './MigrateStakeModal'
import { InfoOutlineIcon } from '@chakra-ui/icons'

export function MigrateStakeForm() {
  const nextBtn = useRef(null)
  const { onClose, onOpen, isOpen } = useDisclosure()

  const { isDisabled, disabledReason, isLoading } = useMigrateStake()

  // eslint-disable-next-line max-len
  const tooltipLabel = `veBAL gauges are the mechanism to distribute BAL liquidity incentives following community voting.
The gauge where you have staked your LP tokens has been deprecated.
So it's likely best for you to migrate to the new gauge in order to get future BAL liquidity incentives.`

  return (
    <Box h="full" w="full" maxW="lg" mx="auto">
      <Card>
        <CardHeader isTruncated>
          Migrate to new staking gauge{' '}
          <Tooltip label={tooltipLabel}>
            <InfoOutlineIcon fontSize="sm" color="grayText" />
          </Tooltip>
        </CardHeader>

        <CardBody>
          <MigrateStakePreview />
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
      <MigrateStakeModal
        finalFocusRef={nextBtn}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
    </Box>
  )
}
