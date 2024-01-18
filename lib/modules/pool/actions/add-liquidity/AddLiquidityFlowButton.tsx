import { useNextTokenApprovalStep } from '@/lib/modules/tokens/approvals/useNextTokenApprovalStep'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { Button, Text, VStack } from '@chakra-ui/react'
import { Pool } from '../../usePool'
import { HumanAmountIn } from '../liquidity-types'
import { useAddLiquidity } from './useAddLiquidity'
import { useConstructAddLiquidityStep } from './useConstructAddLiquidityStep'

type Props = {
  humanAmountsIn: HumanAmountIn[]
  pool: Pool
}
export function AddLiquidityFlowButton({ humanAmountsIn, pool }: Props) {
  const { helpers, isComplete, setIsComplete } = useAddLiquidity()
  const { getTokensByTokenAddress } = useTokens()

  const tokenAddresses = humanAmountsIn.map(h => h.tokenAddress)
  const tokensByAddress = getTokensByTokenAddress(tokenAddresses, pool.chain)

  const { tokenApprovalStep, initialAmountsToApprove } = useNextTokenApprovalStep({
    amountsToApprove: helpers.getAmountsToApprove(humanAmountsIn, tokensByAddress),
    actionType: 'AddLiquidity',
  })

  const { step: addLiquidityStep } = useConstructAddLiquidityStep(pool.id)
  const steps = [tokenApprovalStep, addLiquidityStep]

  function handleJoinCompleted() {
    setIsComplete(true)
  }

  // TODO: define UI for approval steps
  const tokensRequiringApprovalTransaction = initialAmountsToApprove
    ?.map(token => token.tokenSymbol)
    .join(' , ')

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
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={steps}
        />
      )}
    </VStack>
  )
}
