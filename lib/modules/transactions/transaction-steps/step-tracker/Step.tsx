import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { StepProps, getStepSettings } from './getStepSettings'
import { Check } from 'react-feather'
import { ManagedResult } from '../lib'
import type { SubSteps } from '../lib'
import { useTransactionState } from '../TransactionStateProvider'
import { indexToLetter } from '@/lib/shared/labels'

export function Step(props: StepProps) {
  const { getTransaction } = useTransactionState()
  const transaction = getTransaction(props.step.id)
  const { color, isActive, title } = getStepSettings(props, transaction)

  return (
    <HStack alignItems="flex-start">
      <StepIndicator transaction={transaction} {...props}></StepIndicator>
      <VStack spacing="0" alignItems="start">
        <Text mt={isActive ? -0.3 : 0} color={color}>
          {title}
        </Text>
        {props.step?.subSteps && <SubSteps color={color} subSteps={props.step.subSteps} />}
      </VStack>
    </HStack>
  )
}

export function StepIndicator({
  transaction,
  ...props
}: StepProps & { transaction?: ManagedResult }) {
  const { color, isActiveLoading, status, stepNumber } = getStepSettings(props, transaction)

  if (status === 'complete') {
    return (
      <CircularProgress
        value={100}
        trackColor="border.base"
        thickness="8"
        size="7"
        color="font.highlight"
      >
        <CircularProgressLabel fontSize="md" color="font.highlight" pl={1.5}>
          <Check size={15} strokeWidth={4} />
        </CircularProgressLabel>
      </CircularProgress>
    )
  }

  return (
    <CircularProgress
      value={100}
      isIndeterminate={isActiveLoading}
      trackColor="border.base"
      thickness="8"
      size="7"
      color={color}
    >
      <CircularProgressLabel fontSize="sm" fontWeight="bold" color={color}>
        {stepNumber}
      </CircularProgressLabel>
    </CircularProgress>
  )
}

function SubSteps({ color, subSteps }: { color: string; subSteps: SubSteps }) {
  return (
    <Box mt="1" pl="2" p="1">
      {subSteps.gas === 0 && (
        <Text fontSize="sm" color={color} mb="1">
          Signature: Free
        </Text>
      )}
      {subSteps.tokens.length > 1 &&
        subSteps.tokens.map((subStep, index) => (
          <HStack mt="1" key={subStep}>
            <SubStepIndicator color={color} label={indexToLetter(index)} />
            <Text fontSize="sm" color={color}>
              {subStep}
            </Text>
          </HStack>
        ))}
    </Box>
  )
}

function SubStepIndicator({ color, label }: { color: string; label: string }) {
  return (
    <CircularProgress value={100} trackColor="border.base" thickness="8" size="5" color={color}>
      <CircularProgressLabel fontSize="sm" fontWeight="bold" color={color}>
        {label}
      </CircularProgressLabel>
    </CircularProgress>
  )
}
