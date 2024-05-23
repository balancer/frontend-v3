import { useRemoveLiquidity } from '../RemoveLiquidityProvider'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { Card, VStack } from '@chakra-ui/react'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import { usePool } from '../../../PoolProvider'
import { PoolActionsPriceImpactDetails } from '../../PoolActionsPriceImpactDetails'
import { parseUnits } from 'viem'
import { BptRow } from '@/lib/modules/tokens/TokenRow/BptRow'
import { TokenRowGroup } from '@/lib/modules/tokens/TokenRow/TokenRowGroup'
import { bn } from '@/lib/shared/utils/numbers'

export function RemoveLiquidityPreview() {
  const { transactionSteps, quoteBptIn, totalUSDValue, amountsOut, hasQuoteContext } =
    useRemoveLiquidity()
  const { isMobile } = useBreakpoints()
  const { pool } = usePool()

  const _amountsOut = amountsOut.filter(amount => bn(amount.humanAmount).gt(0))

  return (
    <VStack spacing="sm" align="start">
      {isMobile && hasQuoteContext && (
        <MobileStepTracker transactionSteps={transactionSteps} chain={pool.chain} />
      )}

      <Card variant="modalSubSection">
        <BptRow label="You're removing" bptAmount={quoteBptIn} pool={pool} />
      </Card>

      <Card variant="modalSubSection">
        <TokenRowGroup
          label="You're expected to get (if no slippage)"
          amounts={_amountsOut}
          chain={pool.chain}
          totalUSDValue={totalUSDValue}
        />
      </Card>

      <Card variant="modalSubSection">
        <VStack align="start" spacing="sm">
          <PoolActionsPriceImpactDetails
            totalUSDValue={totalUSDValue}
            bptAmount={BigInt(parseUnits(quoteBptIn, 18))}
          />
        </VStack>
      </Card>
    </VStack>
  )
}
