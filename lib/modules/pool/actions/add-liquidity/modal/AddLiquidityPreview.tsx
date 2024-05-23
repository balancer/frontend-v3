'use client'

import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { Card, VStack } from '@chakra-ui/react'
import { usePool } from '../../../PoolProvider'
import { PoolActionsPriceImpactDetails } from '../../PoolActionsPriceImpactDetails'
import { useAddLiquidity } from '../AddLiquidityProvider'
import { QuoteBptOut } from './BptOut'
import { TokenRowGroup } from '@/lib/modules/tokens/TokenRow/TokenRowGroup'
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'

export function AddLiquidityPreview() {
  const {
    totalUSDValue,
    simulationQuery,
    transactionSteps,
    humanAmountsIn,
    hasQuoteContext,
    tokens,
  } = useAddLiquidity()
  const { pool } = usePool()
  const { isMobile } = useBreakpoints()

  // Order amountsIn like the form inputs which uses the tokens array.
  const amountsIn = tokens
    .map(token => humanAmountsIn.find(amount => amount.tokenAddress === token?.address))
    .filter(Boolean) as HumanTokenAmountWithAddress[]

  return (
    <VStack spacing="sm" align="start">
      {isMobile && hasQuoteContext && (
        <MobileStepTracker chain={pool.chain} transactionSteps={transactionSteps} />
      )}

      <Card variant="modalSubSection">
        <TokenRowGroup
          label="You're adding"
          amounts={amountsIn}
          totalUSDValue={totalUSDValue}
          chain={pool.chain}
        />
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
