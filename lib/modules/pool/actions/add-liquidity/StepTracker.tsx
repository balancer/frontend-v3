'use client'

import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Circle,
  CircularProgress,
  CircularProgressLabel,
  ColorMode,
  HStack,
  Text,
  VStack,
  useColorMode,
} from '@chakra-ui/react'

import { CheckIcon } from '@chakra-ui/icons'
import { useAddLiquidity } from './useAddLiquidity'

export function StepTracker() {
  const { stepConfigs, currentStepIndex } = useAddLiquidity()
  const relayerMode = useRelayerMode()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval()
  const hasSignRelayerStep = relayerMode === 'signRelayer'

  function getCurrentIndex() {
    if (hasSignRelayerStep) {
      if (shouldSignRelayerApproval) return 0
      return currentStepIndex + 1
    }
    return currentStepIndex
  }

  function isCurrent(index: number) {
    return getCurrentIndex() === index
  }

  const steps = hasSignRelayerStep ? [{ title: 'Sign relayer' }, ...stepConfigs] : stepConfigs

  const currentStepTitle = steps[getCurrentIndex()].title

  const currentStepPosition = `Step ${getCurrentIndex() + 1}/${steps.length}`

  return (
    <Accordion width="full" variant="gradient" allowToggle textAlign="left">
      <AccordionItem m="0" p="0">
        <AccordionButton p="0" mb="4">
          <HStack width="full" justify="flex-start" fontSize="md">
            <CustomStepIndicator stepNumber={getCurrentIndex() + 1} status="active" />
            <Text>{currentStepTitle}</Text>
          </HStack>
          <HStack justify="flex-end" fontSize="sm">
            <Text whiteSpace="nowrap">{currentStepPosition}</Text>
            <AccordionIcon />
          </HStack>
        </AccordionButton>
        <AccordionPanel marginInlineStart="2" p="0">
          <Steps currentIndex={getCurrentIndex()} steps={steps} isCurrent={isCurrent}></Steps>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
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

type Props = {
  currentIndex: number
  isCurrent: (i: number) => boolean
  steps: { title: string }[]
}

function Steps({ currentIndex, steps, isCurrent }: Props) {
  const { colorMode } = useColorMode()

  function getStatus(index: number) {
    if (index < currentIndex) return 'complete'
    if (index === currentIndex) return 'active'
    return 'incomplete'
  }

  return (
    <VStack alignItems="left">
      {steps.map((step, index) => (
        <HStack key={index} alignItems="start">
          <CustomStepIndicator
            stepNumber={index + 1}
            status={getStatus(index)}
          ></CustomStepIndicator>

          <VStack spacing={0} alignItems="start">
            <Text mt={isCurrent(index) ? -0.3 : 0} color={getColor(colorMode, getStatus(index))}>
              {step.title}
            </Text>
            {isCurrent(index) && (
              <Text variant="secondary" fontSize="0.85rem" m="0" p="0">
                <div>S: {getStatus(index)}</div>
              </Text>
            )}
          </VStack>
        </HStack>
      ))}
    </VStack>
  )
}

export function CustomStepIndicator({
  stepNumber,
  status,
}: {
  stepNumber: number
  status: string
}) {
  const { colorMode } = useColorMode()

  if (status === 'complete') {
    return (
      <Circle size="7" bg="transparent" color="green" border="2px">
        <CheckIcon rounded="full" />
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
