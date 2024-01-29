'use client'

import { ApproveTokenButton } from '@/lib/modules/tokens/approvals/ApproveTokenButton'
import { VStack } from '@chakra-ui/react'
import { AddLiquidityConfig, StepConfig, useIterateSteps } from '../useIterateSteps'
import { AddLiquidityButton } from './AddLiquidityButton'
import { AddLiquidityTimeout } from './AddLiquidityTimeout'
import { useAddLiquidityBuildCallDataQuery } from './queries/useAddLiquidityBuildCallDataQuery'
import { useConstructAddLiquidityStep } from './useConstructAddLiquidityStep'
import { useConstructApproveTokenConfigs } from './useConstructApproveTokenConfigs'

export function AddLiquidityFlow() {
  // const signRelayerConfig: SignRelayerConfig[] = useConstructSignRelayerConfig()
  // const approveRelayerConfig: ApproveRelayerConfig[] = useConstructApproveRelayerConfig()

  const approveTokenConfigs = useConstructApproveTokenConfigs()

  const addLiquidityConfig: AddLiquidityConfig = {
    type: 'addLiquidity',
  }

  const stepConfigs: StepConfig[] = [...approveTokenConfigs, addLiquidityConfig]

  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  const isAddLiquidityStepActive = currentStep.type === 'addLiquidity'

  const buildCallDataQuery = useAddLiquidityBuildCallDataQuery({
    enabled: isAddLiquidityStepActive,
  })

  const { addLiquidityStep, addLiquidityTransaction } =
    useConstructAddLiquidityStep(buildCallDataQuery)

  return (
    <VStack w="full">
      <AddLiquidityTimeout
        addLiquidityTransaction={addLiquidityTransaction}
        isFinalStepActive={isAddLiquidityStepActive}
        buildCallDataQuery={buildCallDataQuery}
      />
      {currentStep.type === 'approveToken' && (
        <ApproveTokenButton
          useOnStepCompleted={useOnStepCompleted}
          {...currentStep.props}
        ></ApproveTokenButton>
      )}

      {currentStep.type === 'addLiquidity' && (
        <AddLiquidityButton addLiquidityStep={addLiquidityStep}></AddLiquidityButton>
      )}
    </VStack>
  )
}
