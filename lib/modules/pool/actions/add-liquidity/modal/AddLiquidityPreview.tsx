'use client'

import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { Card, VStack } from '@chakra-ui/react'
import { usePool } from '../../../usePool'
import { PoolActionsPriceImpactDetails } from '../../PoolActionsPriceImpactDetails'
import { useAddLiquidity } from '../useAddLiquidity'
import { BptOutCardFromQuote } from './BptOutCard'
import { TokensInCardFromQuote } from './TokensInCard'

export function AddLiquidityPreview() {
  const { totalUSDValue, simulationQuery, currentStepIndex, stepConfigs } = useAddLiquidity()
  const { pool } = usePool()
  const { isMobile } = useBreakpoints()

  return (
    <VStack spacing="sm" align="start">
      {isMobile && (
        <MobileStepTracker
          currentStepIndex={currentStepIndex}
          stepConfigs={stepConfigs}
          chain={pool.chain}
        />
      )}

      <TokensInCardFromQuote />

      <BptOutCardFromQuote />

      <Card variant="modalSubSection">
        <VStack align="start" spacing="sm">
          <PoolActionsPriceImpactDetails
            totalUSDValue={totalUSDValue}
            bptAmount={simulationQuery.data?.bptOut.amount}
            isAddLiquidity
          />
        </VStack>
      </Card>
    </VStack>
  )
}
