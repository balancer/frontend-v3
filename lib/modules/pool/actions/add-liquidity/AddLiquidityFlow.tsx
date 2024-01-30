'use client'

import { ApproveTokenButton } from '@/lib/modules/tokens/approvals/ApproveTokenButton'
import { VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { AddLiquidityConfig, StepConfig, useIterateSteps } from '../useIterateSteps'
import { AddLiquidityButton } from './AddLiquidityButton'
import { AddLiquidityTimeout } from './AddLiquidityTimeout'
import { useConstructApproveTokenConfigs } from './useConstructApproveTokenConfigs'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'

export function AddLiquidityFlow() {
  // const signRelayerConfig: SignRelayerConfig[] = useConstructSignRelayerConfig()
  // const approveRelayerConfig: ApproveRelayerConfig[] = useConstructApproveRelayerConfig()

  const [addLiquidityTxState, setAddLiquidityTxState] = useState<TransactionState>()

  const approveTokenConfigs = useConstructApproveTokenConfigs()

  const addLiquidityConfig: AddLiquidityConfig = {
    type: 'addLiquidity',
  }

  const stepConfigs: StepConfig[] = [...approveTokenConfigs, addLiquidityConfig]

  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return (
    <VStack w="full">
      <AddLiquidityTimeout addLiquidityTxState={addLiquidityTxState} />
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
