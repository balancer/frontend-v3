/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { ApproveTokenStep } from '@/lib/modules/tokens/approvals/ApproveTokenStep'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { VStack } from '@chakra-ui/react'
import {
  AddLiquidityMetadata,
  ApproveTokenMetadata,
  StepMetadata,
  useIterateSteps,
} from '../useIterateSteps'
import { useAddLiquidity } from './useAddLiquidity'
import { AddLiquidityStep } from './AddLiquidityStep'
import { getRequiredTokenApprovals } from '@/lib/modules/tokens/approvals/approval-rules'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useAddLiquidityBuildCallDataQuery } from './queries/useAddLiquidityBuildCallDataQuery'
import { AddLiquidityTimeout } from './AddLiquidityTimeout'

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

  const { currentStep, useOnStepCompleted, finalStepTransactionState } = useIterateSteps(steps)

  const isAddLiquidityStepActive = currentStep.type === 'addLiquidity'

  const buildCallDataQuery = useAddLiquidityBuildCallDataQuery({
    enabled: currentStep.type === 'addLiquidity',
  })

  return (
    <VStack w="full">
      <AddLiquidityTimeout
        transactionState={finalStepTransactionState}
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
        <AddLiquidityStep
          useOnStepCompleted={useOnStepCompleted}
          buildCallDataQuery={buildCallDataQuery}
        ></AddLiquidityStep>
      )}

      {}
    </VStack>
  )
}
