'use client'

import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { Button, Text, VStack } from '@chakra-ui/react'
import { useAddLiquidity } from './useAddLiquidity'
import { useEffect } from 'react'

export function AddLiquidityFlowButton() {
  const { setIsComplete, isComplete, initialAmountsToApprove, steps } = useAddLiquidity()

  function handleJoinCompleted() {
    console.log('Join completed')
    setIsComplete(true)
  }

  const tokensRequiringApprovalTransaction = initialAmountsToApprove
    ?.map(token => token.tokenSymbol)
    .join(' , ')

  useEffect(() => {
    console.log('steps', steps)
  }, [steps])

  return (
    <VStack w="full">
      <Text variant="specialSecondary">
        {tokensRequiringApprovalTransaction
          ? `Tokens that require approval step: ${tokensRequiringApprovalTransaction}`
          : 'All tokens have enough allowance'}
      </Text>
      {isComplete ? (
        <Button>Back to pool</Button>
      ) : (
        <TransactionFlow
          completedAlertContent="Successfully added liquidity"
          onComplete={handleJoinCompleted}
          onCompleteClick={() => true}
          completedButtonLabel="Return to pool"
          steps={steps}
        />
      )}
    </VStack>
  )
}
