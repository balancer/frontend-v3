'use client'

import { ApproveTokenButton } from '@/lib/modules/tokens/approvals/ApproveTokenButton'
import { VStack } from '@chakra-ui/react'
import { useIterateSteps } from '../useIterateSteps'
import { AddLiquidityButton } from './AddLiquidityButton'
import { useAddLiquidity } from './useAddLiquidity'
import { useConstructApproveTokenConfigs } from './useConstructApproveTokenConfigs'
import { ApproveRelayerButton } from '@/lib/modules/relayer/ApproveRelayerButton'
import {
  SupportedStepConfig,
  addLiquidityConfig,
  approveRelayerConfig,
  signRelayerConfig,
} from './add-liquidity-configs'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'

export function AddLiquidityFlow() {
  const relayerMode = useRelayerMode()
  const { setAddLiquidityTxState } = useAddLiquidity()

  const approveTokenConfigs = useConstructApproveTokenConfigs()

  let stepConfigs: SupportedStepConfig[] = [...approveTokenConfigs, addLiquidityConfig]

  if (relayerMode === 'approveRelayer') {
    stepConfigs = [approveRelayerConfig, ...stepConfigs]
  }

  if (relayerMode === 'signRelayer') {
    stepConfigs = [signRelayerConfig, ...stepConfigs]
  }

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
