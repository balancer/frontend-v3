import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { Card, HStack, Text, VStack } from '@chakra-ui/react'
import { SwapTokenRow } from '../../tokens/TokenRow/SwapTokenRow'
import { MobileStepTracker } from '../../transactions/transaction-steps/step-tracker/MobileStepTracker'
import { SwapDetails } from '../SwapDetails'
import { SwapRate } from '../SwapRate'
import { useSwap } from '../SwapProvider'
import { Hash } from 'viem'

export function SwapPreview() {
  const { isMobile } = useBreakpoints()
  const { tokenIn, tokenOut, transactionSteps, selectedChain, isWrap, swapTxHash } = useSwap()

  return (
    <VStack spacing="sm" align="start">
      {isMobile && <MobileStepTracker transactionSteps={transactionSteps} chain={selectedChain} />}

      <Card variant="modalSubSection">
        <SwapTokenRow
          label={swapTxHash ? 'You paid' : 'You pay'}
          chain={selectedChain}
          tokenAmount={tokenIn.amount}
          tokenAddress={tokenIn.address}
        />
      </Card>

      <Card variant="modalSubSection">
        <SwapTokenRow
          label={tokenOutLabel(isWrap, swapTxHash)}
          chain={selectedChain}
          tokenAmount={tokenOut.amount}
          tokenAddress={tokenOut.address}
        />
      </Card>

      {!swapTxHash && (
        <Card variant="modalSubSection">
          <SwapDetails />
        </Card>
      )}

      <Card variant="modalSubSection" fontSize="sm">
        <HStack justify="space-between" w="full">
          <Text color="grayText">Exchange rate</Text>
          <SwapRate />
        </HStack>
      </Card>
    </VStack>
  )
}

function tokenOutLabel(isWrap: boolean, swapTxHash?: Hash) {
  if (swapTxHash) return 'You got'
  if (!swapTxHash && isWrap) return "You'll get"
  return "You'll get (if no slippage)"
}
