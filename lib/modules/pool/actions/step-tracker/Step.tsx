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
import { useCurrentFlowStep } from '../useCurrentFlowStep'
import {
  FlowStep,
  TransactionState,
  getTransactionState,
} from '@/lib/shared/components/btns/transaction-steps/lib'

type StepStatus = 'active' | 'complete' | 'incomplete'

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
  const { flowStep } = useCurrentFlowStep()
  const color = getColor(colorMode, getStatus(index), flowStep)

  const isActive = index === currentIndex

  function getStatus(index: number): StepStatus {
    if (index < currentIndex) return 'complete'
    if (index === currentIndex) return 'active'
    return 'incomplete'
  }

  return (
    <HStack key={index} alignItems="start">
      <StepIndicator stepNumber={index + 1} status={getStatus(index)}></StepIndicator>

      <VStack spacing="0" alignItems="start">
        <Text mt={isActive ? -0.3 : 0} color={color}>
          {step.title}
        </Text>
        {isActive && (
          <Text variant="secondary" fontSize="0.85rem" mt="-0.5" p="0" color={color}>
            Gas: ~2.50 S: {getStatus(index)}
            {JSON.stringify(flowStep?.execution.status)}
          </Text>
        )}
      </VStack>
    </HStack>
  )
}

export function StepIndicator({ stepNumber, status }: { stepNumber: number; status: StepStatus }) {
  const { colorMode } = useColorMode()
  const { flowStep } = useCurrentFlowStep()

  if (status === 'complete') {
    return (
      <Circle size="7" bg="transparent" color="green" border="2px" mr="1">
        <CheckIcon fontSize="sm" />
      </Circle>
    )
  }

  const color = getColor(colorMode, status, flowStep)

  const isActiveLoading = isLoading(status, flowStep)

  return (
    <CircularProgress
      value={100}
      isIndeterminate={isActiveLoading}
      thickness="4"
      size="8"
      color={color}
    >
      <CircularProgressLabel fontSize="md" color={color}>
        {stepNumber}
      </CircularProgressLabel>
    </CircularProgress>
  )
}

function getColor(colorMode: ColorMode, status: StepStatus, flowStep?: FlowStep) {
  if (status === 'active') {
    return getActiveColor(flowStep)[colorMode]
  }
  if (status === 'complete') {
    return completeColor[colorMode]
  }
  if (status === 'incomplete') {
    return incompleteColor[colorMode]
  }
  return 'blue'
}

function getActiveColor(flowStep?: FlowStep) {
  if (isLoading('active', flowStep)) return activeConfirmingColor
  return activeColor
}

function isLoading(status: StepStatus, flowStep?: FlowStep): boolean {
  if (!flowStep) return false
  if (status !== 'active') return false

  if (getTransactionState(flowStep) === TransactionState.Loading) {
    return true
  }
  if (getTransactionState(flowStep) === TransactionState.Confirming) {
    return true
  }

  return false
}

/*
  Step Status Colors
  We show different colors depending on the step status and other variables like the step flow state
*/
const completeColor = {
  dark: 'green',
  light: 'green',
}

const incompleteColor = {
  dark: 'gray',
  light: 'gray',
}

const activeColor = {
  dark: 'gradient',
  light: 'blue',
}

// When the current step tx is waiting for wallet confirmation
const activeConfirmingColor = {
  dark: 'orange',
  light: 'orange',
}
