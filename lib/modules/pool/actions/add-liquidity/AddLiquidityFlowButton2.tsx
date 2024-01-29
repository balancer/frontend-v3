/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { ApproveTokenStep } from '@/lib/modules/tokens/approvals/ApproveTokenStep'
import { getRequiredTokenApprovals } from '@/lib/modules/tokens/approvals/approval-rules'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { getTransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { VStack } from '@chakra-ui/react'
import {
  AddLiquidityMetadata,
  ApproveTokenMetadata,
  StepMetadata,
  useIterateSteps,
} from '../useIterateSteps'
import { AddLiquidityStep } from './AddLiquidityStep'
import { AddLiquidityTimeout } from './AddLiquidityTimeout'
import { useAddLiquidityBuildCallDataQuery } from './queries/useAddLiquidityBuildCallDataQuery'
import { useAddLiquidity } from './useAddLiquidity'
import { useConstructAddLiquidityStep } from './useConstructAddLiquidityStep'

export function AddLiquidityFlowButton2() {
  //TODO: Export all logic to testable hook
  const { userAddress } = useUserAccount()
  const { tokenAllowances, helpers, humanAmountsIn } = useAddLiquidity()
  const { chainId, chain } = useNetworkConfig()

  const tokenAmountsToApprove = getRequiredTokenApprovals({
    chainId,
    amountsToApprove: helpers.getAmountsToApprove(humanAmountsIn),
    allowanceFor: tokenAllowances.allowanceFor,
  })

  const tokenStepRequests: ApproveTokenMetadata[] = tokenAmountsToApprove.map(
    ({ tokenAddress, rawAmount }) => {
      return {
        type: 'approveToken',
        props: {
          actionType: 'AddLiquidity',
          chain,
          amountToApprove: rawAmount,
          spenderAddress: userAddress,
          tokenAddress,
          tokenAllowances,
        },
      }
    }
  )

  const stepAddLiquidity: AddLiquidityMetadata = {
    type: 'addLiquidity',
  }

  // Think about renaming step prefix
  const steps: StepMetadata[] = [...tokenStepRequests, stepAddLiquidity]

  const { currentStep, useOnStepCompleted } = useIterateSteps(steps)

  const isAddLiquidityStepActive = currentStep.type === 'addLiquidity'

  const buildCallDataQuery = useAddLiquidityBuildCallDataQuery({
    enabled: isAddLiquidityStepActive,
  })

  const { addLiquidityStep, addLiquidityTransaction } =
    useConstructAddLiquidityStep(buildCallDataQuery)

  const finalTransactionState = getTransactionState(addLiquidityTransaction)

  return (
    <VStack w="full">
      <AddLiquidityTimeout
        addLiquidityTransactionState={finalTransactionState}
        isFinalStepActive={isAddLiquidityStepActive}
        buildCallDataQuery={buildCallDataQuery}
      />
      {currentStep.type === 'approveToken' && (
        <ApproveTokenStep
          useOnStepCompleted={useOnStepCompleted}
          {...currentStep.props}
        ></ApproveTokenStep>
      )}

      {currentStep.type === 'addLiquidity' && (
        <AddLiquidityStep addLiquidityStep={addLiquidityStep}></AddLiquidityStep>
      )}
    </VStack>
  )
}
