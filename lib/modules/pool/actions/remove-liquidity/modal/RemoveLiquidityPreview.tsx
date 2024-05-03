import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { Card, VStack, Text } from '@chakra-ui/react'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { usePool } from '../../../usePool'
import { PoolActionsPriceImpactDetails } from '../../PoolActionsPriceImpactDetails'
import { parseUnits, Address } from 'viem'
import { useTransactionFlow } from '@/lib/modules/transactions/transaction-steps/TransactionFlowProvider'

export function RemoveLiquidityPreview() {
  const {
    tokens,
    isProportional,
    isSingleToken,
    singleTokenOutAddress,
    stepConfigs,
    currentStepIndex,
    quoteBptIn,
    totalUSDValue,
    amountOutForToken,
  } = useRemoveLiquidity()
  const { isMobile } = useBreakpoints()
  const { pool } = usePool()
  const { isFlowComplete, SuccessCard } = useTransactionFlow()

  return (
    <VStack spacing="sm" align="start">
      {isFlowComplete && <SuccessCard chain={pool.chain} />}

      {isMobile && (
        <MobileStepTracker
          currentStepIndex={currentStepIndex}
          stepConfigs={stepConfigs}
          chain={pool.chain}
        />
      )}

      <Card variant="modalSubSection">
        <VStack align="start" spacing="md">
          <Text fontWeight="bold" fontSize="sm">
            You&apos;re removing
          </Text>
          <TokenRow
            value={quoteBptIn}
            address={pool.address as Address}
            chain={pool.chain}
            isBpt={true}
            pool={pool}
          />
        </VStack>
      </Card>

      <Card variant="modalSubSection">
        <VStack align="start" spacing="md">
          <Text fontWeight="bold" fontSize="sm">
            You&apos;re expected to get (if no slippage)
          </Text>
          {isProportional &&
            tokens.map(
              token =>
                token && (
                  <TokenRow
                    key={token.address}
                    address={token.address as Address}
                    chain={pool.chain}
                    value={amountOutForToken(token.address as Address)}
                  />
                )
            )}
          {isSingleToken && (
            <TokenRow
              address={singleTokenOutAddress as Address}
              chain={pool.chain}
              value={amountOutForToken(singleTokenOutAddress as Address)}
            />
          )}
        </VStack>
      </Card>

      {!isFlowComplete && (
        <Card variant="modalSubSection">
          <VStack align="start" spacing="sm">
            <PoolActionsPriceImpactDetails
              totalUSDValue={totalUSDValue}
              bptAmount={BigInt(parseUnits(quoteBptIn, 18))}
            />
          </VStack>
        </Card>
      )}
    </VStack>
  )
}
