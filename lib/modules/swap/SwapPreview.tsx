import { Card, CardHeader, HStack, VStack, Text } from '@chakra-ui/react'
import { MobileStepTracker } from '../transactions/transaction-steps/step-tracker/MobileStepTracker'
import TokenRow from '../tokens/TokenRow/TokenRow'
import { SwapDetails } from './SwapDetails'
import { SwapRate } from './SwapRate'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { useSwap } from './useSwap'
import { useCurrentFlowStep } from '../transactions/transaction-steps/useCurrentFlowStep'

export function SwapPreview() {
  const { isFlowComplete, SuccessCard } = useCurrentFlowStep()
  const { isMobile } = useBreakpoints()
  const { tokenIn, tokenOut, currentStepIndex, swapStepConfigs, selectedChain } = useSwap()

  return (
    <VStack spacing="sm" align="start">
      {isFlowComplete && <SuccessCard chain={selectedChain} />}

      {isMobile && (
        <MobileStepTracker
          currentStepIndex={currentStepIndex}
          stepConfigs={swapStepConfigs}
          chain={selectedChain}
        />
      )}

      <Card variant="modalSubSection">
        <CardHeader>You pay</CardHeader>
        <TokenRow
          address={tokenIn.address}
          value={tokenIn.amount}
          chain={selectedChain}
          abbreviated={false}
        />
      </Card>

      <Card variant="modalSubSection">
        <CardHeader>You&apos;ll get (if no slippage)</CardHeader>
        <TokenRow
          address={tokenOut.address}
          value={tokenOut.amount}
          chain={selectedChain}
          abbreviated={false}
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
