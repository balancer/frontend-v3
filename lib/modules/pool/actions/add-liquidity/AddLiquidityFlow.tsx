'use client'

import { ApproveTokenButton } from '@/lib/modules/tokens/approvals/ApproveTokenButton'
import { VStack } from '@chakra-ui/react'
import { useIterateSteps } from '../useIterateSteps'
import { AddLiquidityButton } from './AddLiquidityButton'
import { useAddLiquidity } from './useAddLiquidity'
import { ApproveRelayerButton } from '@/lib/modules/relayer/ApproveRelayerButton'
import { AddLiquidityStepType } from './useAddLiquidityStepConfigs'

export function AddLiquidityFlow() {
  const { setAddLiquidityTxState, stepConfigs } = useAddLiquidity()

  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return (
    <VStack w="full">
      {currentStep.type === AddLiquidityStepType.APPROVE_RELAYER && (
        <ApproveRelayerButton useOnStepCompleted={useOnStepCompleted}></ApproveRelayerButton>
      )}

      {currentStep.type === AddLiquidityStepType.APPROVE_TOKEN && (
        <ApproveTokenButton
          useOnStepCompleted={useOnStepCompleted}
          {...currentStep.props}
        ></ApproveTokenButton>
      )}

      {currentStep.type === AddLiquidityStepType.ADD_LIQUIDITY && (
        <AddLiquidityButton onTransactionStateUpdate={setAddLiquidityTxState}></AddLiquidityButton>
      )}
    </VStack>
  )
}
