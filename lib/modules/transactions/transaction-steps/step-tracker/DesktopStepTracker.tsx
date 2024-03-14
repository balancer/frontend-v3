'use client'

import { Divider, Heading, VStack, useTheme } from '@chakra-ui/react'
import { StepTrackerProps } from './step-tracker.types'
import { useStepTrackerProps } from './useStepTrackerProps'
import { Steps } from './Steps'

export function DesktopStepTracker(props: StepTrackerProps) {
  const theme = useTheme()
  const { colorMode, currentIndex, steps } = useStepTrackerProps(props)

  return (
    <VStack
      p="2"
      width="200px"
      rounded="md"
      bg={theme.colors.base[colorMode]}
      right="-224px"
      position="absolute"
      alignItems="flex-start"
    >
      <Heading fontWeight="bold" size="h5">
        Steps
      </Heading>
      <Divider p="0" />
      <Steps currentIndex={currentIndex} steps={steps}></Steps>
    </VStack>
  )
}
