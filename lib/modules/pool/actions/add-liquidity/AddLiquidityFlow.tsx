'use client'

import { VStack } from '@chakra-ui/react'
import { useIterateSteps } from '../useIterateSteps'
import { useAddLiquidity } from './useAddLiquidity'

export function AddLiquidityFlow() {
  const { stepConfigs } = useAddLiquidity()

  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return <VStack w="full">{currentStep.render(useOnStepCompleted)}</VStack>
}
