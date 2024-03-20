'use client'

import { Card, Box, Divider, HStack, Heading, VStack, Text } from '@chakra-ui/react'
import { StepTrackerProps } from './step-tracker.types'
import { useStepTrackerProps } from './useStepTrackerProps'
import { Steps } from './Steps'
import { useGasPriceQuery } from '@/lib/shared/hooks/useGasPrice'
import { GasIcon } from '@/lib/shared/components/icons/GasIcon'

export function DesktopStepTracker(props: StepTrackerProps) {
  const { currentIndex, steps, chain } = useStepTrackerProps(props)
  const { gasPrice } = useGasPriceQuery(chain)

  return (
    <Card variant="level2" rounded="md" width="200px" right="-224px" position="absolute">
      <VStack alignItems="flex-start" w="full">
        <HStack p="sm" pb="0" justify="space-between" w="full">
          <Heading fontWeight="bold" size="h6">
            Steps
          </Heading>
          <Box
            p="xs"
            shadow="sm"
            background="background.level3"
            rounded="sm"
            color="font.highlight"
          >
            <HStack spacing="xs">
              <GasIcon size={16} />
              <Text color="font.highlight" fontWeight="bold" fontSize="xs">
                {gasPrice ? gasPrice.toString() : '-'}
              </Text>
            </HStack>
          </Box>
        </HStack>

        <Divider p="0" />
        <Steps currentIndex={currentIndex} steps={steps} />
      </VStack>
    </Card>
  )
}
