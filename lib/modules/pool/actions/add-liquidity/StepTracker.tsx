'use client'

import { Text, VStack } from '@chakra-ui/react'
import { useAddLiquidity } from './useAddLiquidity'
import { useCurrentFlowStep } from '../useCurrentFlowStep'
import { StepConfig } from '../useIterateSteps'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { noop } from 'lodash'

export function StepTracker() {
  const { stepConfigs, currentStepIndex } = useAddLiquidity()
  const relayerMode = useRelayerMode()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval()

  const hasSignRelayerStep = relayerMode === 'signRelayer'

  const signRelayerConfig = { description: 'Sign relayer', render: noop } as StepConfig

  function isCurrent(index: number) {
    return currentStepIndex === index && !shouldSignRelayerApproval
  }

  function getStepNumber(index: number) {
    return shouldSignRelayerApproval ? index + 2 : index + 1
  }

  return (
    <VStack align="flex-start">
      {hasSignRelayerStep && (
        <Step stepNumber={0} config={signRelayerConfig} isCurrent={shouldSignRelayerApproval} />
      )}

      {stepConfigs.map((config, index) => (
        <Step
          key={config.description}
          stepNumber={getStepNumber(index)}
          isCurrent={isCurrent(index)}
          config={config}
        />
      ))}
    </VStack>
  )
}

type Props = {
  stepNumber: number
  isCurrent: boolean
  config: StepConfig
}
function Step({ stepNumber, isCurrent, config }: Props) {
  const { flowStep } = useCurrentFlowStep()

  return (
    <VStack>
      <Text>
        {isCurrent && '*'} {stepNumber} {config.description}
      </Text>
      {isCurrent && flowStep && <Text>{JSON.stringify(flowStep.execution.status)}</Text>}
    </VStack>
  )
}
