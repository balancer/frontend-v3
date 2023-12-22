import { useNextTokenApprovalStep } from '@/lib/modules/tokens/approvals/useNextTokenApprovalStep'
import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { Text, VStack } from '@chakra-ui/react'
import { useConstructAddLiquidityStep } from './useConstructAddLiquidityStep'
import { useAddLiquidity } from './useAddLiquidity'
import { HumanAmountIn } from '../liquidity-types'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { zipObject } from 'lodash'
import { Pool } from '../../usePool'

type Props = {
  humanAmountsIn: HumanAmountIn[]
  pool: Pool
}
export function AddLiquidityFlowButton({ humanAmountsIn, pool }: Props) {
  const { helpers } = useAddLiquidity()
  const { getToken } = useTokens()

  const tokenAddresses = humanAmountsIn.map(h => h.tokenAddress)
  const tokens = humanAmountsIn.map(h => getToken(h.tokenAddress, pool.chain))
  const tokensByAddress = zipObject(tokenAddresses, tokens as GqlToken[])

  const { tokenApprovalStep, initialAmountsToApprove } = useNextTokenApprovalStep(
    helpers.getAmountsToApprove(humanAmountsIn, tokensByAddress)
  )

  const { step: addLiquidityStep } = useConstructAddLiquidityStep(pool.id)
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
