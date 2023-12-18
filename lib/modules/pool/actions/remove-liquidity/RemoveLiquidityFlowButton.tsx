import { useNextTokenApprovalStep } from '@/lib/modules/tokens/approvals/useNextTokenApprovalStep'
import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { Text, VStack } from '@chakra-ui/react'
import { useConstructRemoveLiquidityStep } from './useConstructRemoveLiquidityStep'
import { useRemoveLiquidity } from './useRemoveLiquidity'
import { HumanAmountIn } from '../liquidity-types'

export type HumanAmountInWithTokenInfo = HumanAmountIn & GqlToken

type Props = {
  humanAmountsInWithTokenInfo: HumanAmountInWithTokenInfo[]
  poolId: string
}
export function RemoveLiquidityFlowButton({ humanAmountsInWithTokenInfo, poolId }: Props) {
  const { helpers } = useRemoveLiquidity()
  const { tokenApprovalStep, initialAmountsToApprove } = useNextTokenApprovalStep(
    helpers.getAmountsToApprove(humanAmountsInWithTokenInfo)
  )

  const { step: addLiquidityStep } = useConstructRemoveLiquidityStep(poolId)
  const steps = [tokenApprovalStep, addLiquidityStep]

  function handleRemoveCompleted() {
    console.log('Remove completed')
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
        completedAlertContent="Successfully removed liquidity"
        onCompleteClick={handleRemoveCompleted}
        completedButtonLabel="Return to pool"
        steps={steps}
      />
    </VStack>
  )
}
