/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { daiAddress, usdcAddress } from '@/lib/debug-helpers'
import { ApproveTokenStep } from '@/lib/modules/tokens/approvals/ApproveTokenStep'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Text, VStack } from '@chakra-ui/react'
import {
  ApproveTokenMetadata,
  StepMetadata,
  stepAddLiquidity,
  useIterateSteps,
} from '../useIterateSteps'
import { useAddLiquidity } from './useAddLiquidity'

export function AddLiquidityFlowButton2() {
  const { userAddress } = useUserAccount()
  const { tokenAllowances } = useAddLiquidity()

  const stepApproval1: ApproveTokenMetadata = {
    type: 'approveToken',
    props: {
      actionType: 'AddLiquidity',
      chain: GqlChain.Mainnet,
      amountToApprove: 100n,
      spenderAddress: userAddress,
      tokenAddress: daiAddress,
      tokenAllowances,
    },
  }

  const stepApproval2: ApproveTokenMetadata = {
    type: 'approveToken',
    props: {
      actionType: 'AddLiquidity',
      chain: GqlChain.Mainnet,
      amountToApprove: 200n,
      spenderAddress: userAddress,
      tokenAddress: usdcAddress,
      tokenAllowances,
    },
  }

  const steps: StepMetadata[] = [stepApproval1, stepApproval2, stepAddLiquidity]

  const { currentStep, useOnStepCompleted } = useIterateSteps(steps)

  return (
    <VStack w="full">
      {currentStep.type === 'approveToken' && (
        <ApproveTokenStep
          useOnStepCompleted={useOnStepCompleted}
          {...currentStep.props}
        ></ApproveTokenStep>
      )}

      {currentStep.type === 'addLiquidity' && <Text> Add liquidity {currentStep.props}</Text>}
    </VStack>
  )
}
