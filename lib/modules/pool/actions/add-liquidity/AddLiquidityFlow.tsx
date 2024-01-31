'use client'

import { ApproveTokenButton } from '@/lib/modules/tokens/approvals/ApproveTokenButton'
import { VStack } from '@chakra-ui/react'
import { useIterateSteps } from '../useIterateSteps'
import { AddLiquidityButton } from './AddLiquidityButton'
import { useAddLiquidity } from './useAddLiquidity'
import { useConstructApproveTokenConfigs } from './useConstructApproveTokenConfigs'

export function AddLiquidityFlow() {
  // const signRelayerConfig: SignRelayerConfig[] = useConstructSignRelayerConfig()
  // const approveRelayerConfig: ApproveRelayerConfig[] = useConstructApproveRelayerConfig()

  const { setAddLiquidityTxState } = useAddLiquidity()

  const approveTokenConfigs = useConstructApproveTokenConfigs()

  interface AddLiquidityConfig {
    type: 'addLiquidity'
    // no props
  }

  const addLiquidityConfig: AddLiquidityConfig = {
    type: 'addLiquidity',
  }

  const stepConfigs = [...approveTokenConfigs, addLiquidityConfig]

  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return (
    <VStack w="full">
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
