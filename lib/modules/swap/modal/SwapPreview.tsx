import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { Card, HStack, Text, VStack } from '@chakra-ui/react'
import { SwapTokenRow } from '../../tokens/TokenRow/SwapTokenRow'
import { MobileStepTracker } from '../../transactions/transaction-steps/step-tracker/MobileStepTracker'
import { SwapDetails } from '../SwapDetails'
import { SwapRate } from '../SwapRate'
import { useSwap } from '../useSwap'

export function SwapPreview() {
  const { isMobile } = useBreakpoints()
  const { tokenIn, tokenOut, transactionSteps, selectedChain } = useSwap()

  return (
    <VStack spacing="sm" align="start">
      {isMobile && <MobileStepTracker transactionSteps={transactionSteps} chain={selectedChain} />}

      <Card variant="modalSubSection">
        <SwapTokenRow
          label="You pay"
          chain={selectedChain}
          tokenAmount={tokenIn.amount}
          tokenAddress={tokenIn.address}
        />
      </Card>

      <Card variant="modalSubSection">
        <SwapTokenRow
          label="You'll get (if no slippage)"
          chain={selectedChain}
          tokenAmount={tokenOut.amount}
          tokenAddress={tokenOut.address}
        />
      </Card>

      <Card variant="modalSubSection">
        <SwapDetails />
      </Card>

      <Card variant="modalSubSection" fontSize="sm">
        <HStack justify="space-between" w="full">
          <Text color="grayText">Exchange rate</Text>
          <SwapRate />
        </HStack>
      </Card>
    </VStack>
  )
}
