import { useNextTokenApprovalStep } from '@/lib/modules/tokens/approvals/useNextTokenApprovalStep'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { Button, Text, VStack } from '@chakra-ui/react'
import { Pool } from '../../usePool'
import { HumanAmountIn } from '../liquidity-types'
import { useAddLiquidity } from './useAddLiquidity'
import { useConstructAddLiquidityStep } from './useConstructAddLiquidityStep'
import { getTransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { use, useEffect } from 'react'
import { init } from '@graphql-codegen/cli'
import { useTraceUpdate } from '@/lib/shared/hooks/useTraceUpdate'

type Props = {
  humanAmountsIn: HumanAmountIn[]
  pool: Pool
}
export function AddLiquidityFlowButton({ humanAmountsIn, pool }: Props) {
  console.log('Render AddLiquidityFlowButton')
  const { helpers, setIsComplete, setAddLiquidityTransactionState, isComplete } = useAddLiquidity()
  const { getTokensByTokenAddress } = useTokens()

  const tokenAddresses = humanAmountsIn.map(h => h.tokenAddress)
  const tokensByAddress = getTokensByTokenAddress(tokenAddresses, pool.chain)

  const { tokenApprovalStep, initialAmountsToApprove } = useNextTokenApprovalStep({
    amountsToApprove: helpers.getAmountsToApprove(humanAmountsIn, tokensByAddress),
    actionType: 'AddLiquidity',
  })

  const { step: addLiquidityStep, transaction } = useConstructAddLiquidityStep(pool.id)
  const steps = [addLiquidityStep]

  // if (initialAmountsToApprove?.length) steps.unshift(tokenApprovalStep)

  // const addLiquidityTransactionState = getTransactionState(transaction)

  function handleJoinCompleted() {
    console.log('Join completed')
    setIsComplete(true)
  }

  // TODO: define UI for approval steps
  const tokensRequiringApprovalTransaction = initialAmountsToApprove
    ?.map(token => token.tokenSymbol)
    .join(' , ')

  // useEffect(() => {
  //   setAddLiquidityTransactionState(addLiquidityTransactionState)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [addLiquidityTransactionState, setAddLiquidityTransactionState])

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
