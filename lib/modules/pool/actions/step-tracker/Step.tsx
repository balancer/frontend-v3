import { CheckIcon } from '@chakra-ui/icons'
import {
  useColorMode,
  HStack,
  VStack,
  Circle,
  CircularProgress,
  CircularProgressLabel,
  ColorMode,
  Text,
} from '@chakra-ui/react'

export function Step({
  index,
  currentIndex,
  step,
}: {
  step: { title: string }
  index: number
  currentIndex: number
}) {
  const { colorMode } = useColorMode()
  const color = getColor(colorMode, getStatus(index))

  const isCurrent = index === currentIndex

  function getStatus(index: number) {
    if (index < currentIndex) return 'complete'
    if (index === currentIndex) return 'active'
    return 'incomplete'
  }

  return (
    <HStack key={index} alignItems="start">
      <StepIndicator stepNumber={index + 1} status={getStatus(index)}></StepIndicator>

      <VStack spacing="0" alignItems="start">
        <Text mt={isCurrent ? -0.3 : 0} color={color}>
          {step.title}
        </Text>
        {isCurrent && (
          <Text variant="secondary" fontSize="0.85rem" mt="-0.5" p="0" color={color}>
            Gas: ~2.50
            {/* S: {getStatus(index)} */}
          </Text>
        )}
      </VStack>
    </HStack>
  )
}

export function StepIndicator({ stepNumber, status }: { stepNumber: number; status: string }) {
  const { colorMode } = useColorMode()

  if (status === 'complete') {
    return (
      <Circle size="7" bg="transparent" color="green" border="2px" mr="1">
        <CheckIcon fontSize="sm" />
      </Circle>
    )
  }

  return (
    <CircularProgress value={100} thickness="4" size="8" color={getColor(colorMode, status)}>
      <CircularProgressLabel fontSize="md" color={getColor(colorMode, status)}>
        {stepNumber}
      </CircularProgressLabel>
    </CircularProgress>
  )
}

function getColor(colorMode: ColorMode, status: string) {
  const activeColor = {
    dark: 'gradient',
    light: 'blue',
  }

  const completeColor = {
    dark: 'green',
    light: 'green',
  }

  const incompleteColor = {
    dark: 'gray',
    light: 'gray',
  }
  if (status === 'active') {
    return activeColor[colorMode]
  }
  if (status === 'complete') {
    return completeColor[colorMode]
  }
  if (status === 'incomplete') {
    return incompleteColor[colorMode]
  }
  return 'blue'
}
