import { CheckIcon } from '@chakra-ui/icons'
import {
  Circle,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { StepProps, getStepSettings } from './getStepSettings'

export function Step(props: StepProps) {
  const { color, isActive, title } = getStepSettings(props)

  return (
    <HStack alignItems="center">
      <StepIndicator {...props}></StepIndicator>
      <VStack spacing="0" alignItems="start">
        <Text mt={isActive ? -0.3 : 0} color={color}>
          {title}
        </Text>
      </VStack>
    </HStack>
  )
}

export function StepIndicator(props: StepProps) {
  const { color, isActiveLoading, status, stepNumber } = getStepSettings(props)

  if (status === 'complete') {
    return (
      <Circle size="7" bg="transparent" color="font.highlight" border="2px" mr="1">
        <CheckIcon fontSize="sm" />
      </Circle>
    )
  }

  return (
    <CircularProgress
      value={100}
      isIndeterminate={isActiveLoading}
      thickness="8"
      size="7"
      color={color}
    >
      <CircularProgressLabel fontSize="md" color={color}>
        {stepNumber}
      </CircularProgressLabel>
    </CircularProgress>
  )
}
