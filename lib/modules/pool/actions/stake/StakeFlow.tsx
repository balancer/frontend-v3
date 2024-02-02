'use client'

import { ApproveTokenButton } from '@/lib/modules/tokens/approvals/ApproveTokenButton'
import { VStack } from '@chakra-ui/react'
import { useIterateSteps } from '../useIterateSteps'
import { StakeButton } from './StakeButton'
import { useStaking } from './useStaking'

export function StakeFlow() {
  const { bptApprovalStepConfig } = useStaking()

  interface StakeConfig {
    type: 'stake'
    // no props
  }

  const stakeConfig: StakeConfig = {
    type: 'stake',
  }

  const stepConfigs = [...bptApprovalStepConfig, stakeConfig]

  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return (
    <VStack w="full">
      {currentStep.type === 'approveToken' && (
        <ApproveTokenButton
          useOnStepCompleted={useOnStepCompleted}
          {...currentStep.props}
        ></ApproveTokenButton>
      )}
      {currentStep.type === 'stake' && <StakeButton />}
    </VStack>
  )
}
