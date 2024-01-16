import { Button, Tooltip } from '@chakra-ui/react'
import { useSwap } from './useSwap'
import { useNextTokenApprovalStep } from '../tokens/approvals/useNextTokenApprovalStep'
import { useTokens } from '../tokens/useTokens'
import { parseUnits } from 'viem'
import { HumanAmount } from '@balancer/sdk'

export function SwapFlowButton() {
  const { isDisabled, disabledReason, isLoading, tokenIn, selectedChain } = useSwap()
  const { getToken } = useTokens()

  const approvalToken = getToken(tokenIn.address, selectedChain)

  if (!approvalToken) throw new Error('Approval token not found')

  const rawApprovalAmount = parseUnits(tokenIn.amount, approvalToken.decimals)

  const { tokenApprovalStep, initialAmountsToApprove } = useNextTokenApprovalStep({
    amountsToApprove: [
      {
        rawAmount: rawApprovalAmount,
        humanAmount: tokenIn.amount as HumanAmount,
        tokenAddress: tokenIn.address,
        tokenSymbol: approvalToken.symbol,
      },
    ],
    actionType: 'Swapping',
  })

  const { step: addLiquidityStep } = useConstructAddLiquidityStep(pool.id)
  const steps = [tokenApprovalStep, addLiquidityStep]

  function submit() {
    console.log('swap')
  }

  return (
    <Tooltip label={isDisabled ? '' : disabledReason}>
      <Button
        variant="secondary"
        w="full"
        size="lg"
        isDisabled={isDisabled}
        isLoading={isLoading}
        onClick={submit}
      >
        Swap
      </Button>
    </Tooltip>
  )
}
