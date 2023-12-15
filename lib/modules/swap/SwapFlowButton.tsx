import { Button, Tooltip } from '@chakra-ui/react'
import { useSwap } from './useSwap'
// import { useNextTokenApprovalStep } from '../tokens/approvals/useNextTokenApprovalStep'
// import { TokenAmountToApprove } from '../tokens/approvals/approval-rules'

export function SwapFlowButton() {
  const { isDisabled, isLoading } = useSwap()

  // const amountToApprove: TokenAmountToApprove = {
  //   rawAmount: '0x',
  //   humanAmount: '0x',
  //   tokenAddress: '0x',
  //   tokenSymbol: '0x',
  // }

  // const { tokenApprovalStep, initialAmountsToApprove } = useNextTokenApprovalStep(
  //   helpers.getAmountsToApprove(humanAmountsInWithTokenInfo)
  // )

  function submit() {
    console.log('swap')
  }

  return (
    <Tooltip label={isDisabled ? '' : 'cannot execute swap'}>
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
