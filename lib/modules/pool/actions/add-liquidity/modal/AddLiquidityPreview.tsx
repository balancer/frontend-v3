'use client'

import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { Card, VStack } from '@chakra-ui/react'
import { usePool } from '../../../usePool'
import { PoolActionsPriceImpactDetails } from '../../PoolActionsPriceImpactDetails'
import { useAddLiquidity } from '../useAddLiquidity'
import { QuoteBptOut } from './BptOut'
import { QuoteTokensIn } from './TokensIn'

export function AddLiquidityPreview() {
  const { totalUSDValue, simulationQuery, transactionSteps } = useAddLiquidity()
  const { pool } = usePool()
  const { isMobile } = useBreakpoints()

  return (
    <VStack spacing="sm" align="start">
      {isMobile && <MobileStepTracker chain={pool.chain} transactionSteps={transactionSteps} />}

      <Card variant="modalSubSection">
        <QuoteTokensIn />
      </Card>

      <Card variant="modalSubSection">
        <QuoteBptOut />
      </Card>

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
