'use client'

import { ApproveTokenButton } from '@/lib/modules/tokens/approvals/ApproveTokenButton'
import { VStack } from '@chakra-ui/react'
import { useIterateSteps } from '../useIterateSteps'
import { AddLiquidityButton } from './AddLiquidityButton'
import { useAddLiquidity } from './useAddLiquidity'
import { ApproveRelayerButton } from '@/lib/modules/relayer/ApproveRelayerButton'

export function AddLiquidityFlow() {
  const { setAddLiquidityTxState, stepConfigs } = useAddLiquidity()

  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return (
    <VStack w="full">
      {currentStep.type === 'approveRelayer' && (
        <ApproveRelayerButton useOnStepCompleted={useOnStepCompleted}></ApproveRelayerButton>
      )}

      {currentStep.type === 'approveToken' && (
        <ApproveTokenButton
          useOnStepCompleted={useOnStepCompleted}
          {...currentStep.props}
        ></ApproveTokenButton>
      )}

      {currentStep.type === 'addLiquidity' && (
        <AddLiquidityButton onTransactionStateUpdate={setAddLiquidityTxState}></AddLiquidityButton>
      )}
    </VStack>
  )
}
