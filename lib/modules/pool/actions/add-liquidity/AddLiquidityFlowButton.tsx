import { useNextTokenApprovalStep } from '@/lib/modules/tokens/approvals/useNextTokenApprovalStep'
import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { Text, VStack } from '@chakra-ui/react'
import { useConstructAddLiquidityStep } from './useConstructAddLiquidityStep'
import { useAddLiquidity } from './useAddLiquidity'
import { HumanAmountIn } from '../liquidity-types'

export type HumanAmountInWithTokenInfo = HumanAmountIn & GqlToken

type Props = {
  humanAmountsInWithTokenInfo: HumanAmountInWithTokenInfo[]
  poolId: string
}
export function AddLiquidityFlowButton({ humanAmountsInWithTokenInfo, poolId }: Props) {
  const { helpers } = useAddLiquidity()
  const { tokenApprovalStep, initialAmountsToApprove } = useNextTokenApprovalStep(
    helpers.getAmountsToApprove(humanAmountsInWithTokenInfo)
  )

  const { step: addLiquidityStep } = useConstructAddLiquidityStep(poolId)
  const steps = [tokenApprovalStep, addLiquidityStep]

  function handleJoinCompleted() {
    console.log('Join completed')
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
      <TransactionFlow
        completedAlertContent="Successfully added liquidity"
        onCompleteClick={handleJoinCompleted}
        completedButtonLabel="Return to pool"
        steps={steps}
      />
    </VStack>
  )
}
