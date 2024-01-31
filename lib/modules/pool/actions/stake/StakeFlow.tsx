'use client'

import { ApproveTokenButton } from '@/lib/modules/tokens/approvals/ApproveTokenButton'
import { VStack } from '@chakra-ui/react'
import { useIterateSteps } from '../useIterateSteps'
import { useConstructApproveBptConfigs } from './useConstructApproveBptConfig'
import { StakeButton } from './StakeButton'

export function StakeFlow() {
  // const signRelayerConfig: SignRelayerConfig[] = useConstructSignRelayerConfig()
  // const approveRelayerConfig: ApproveRelayerConfig[] = useConstructApproveRelayerConfig()

  const approveTokenConfigs = useConstructApproveBptConfigs()

  interface StakeConfig {
    type: 'stake'
    // no props
  }

  const stakeConfig: StakeConfig = {
    type: 'stake',
  }

  const stepConfigs = [...approveTokenConfigs, stakeConfig]

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
