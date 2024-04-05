'use client'

import { Card, Box, Divider, HStack, Heading, VStack } from '@chakra-ui/react'
import { StepTrackerProps } from './step-tracker.types'
import { useStepTrackerProps } from './useStepTrackerProps'
import { Steps } from './Steps'
import { GasPriceCard } from '@/lib/shared/hooks/useGasPrice'

export function DesktopStepTracker(props: StepTrackerProps) {
  const { currentIndex, steps, chain } = useStepTrackerProps(props)

  return (
    <Card padding={0} width="200px" right="-224px" position="absolute">
      <VStack alignItems="flex-start" w="full">
        <HStack p="sm" pb="0" justify="space-between" w="full">
          <Heading fontWeight="bold" size="h6">
            Steps
          </Heading>
          <GasPriceCard chain={chain} />
        </HStack>

        <Divider p="0" />
        <Box p="sm" pb="md">
          <Steps currentIndex={currentIndex} steps={steps} />
        </Box>
      </VStack>
    </Card>
  )
}
