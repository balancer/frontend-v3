'use client'

import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { isSameAddress } from '@balancer/sdk'
import { Card, HStack, Text, VStack } from '@chakra-ui/react'
import { Address, formatUnits } from 'viem'
import { BPT_DECIMALS } from '../../../pool.constants'
import { usePool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { useAddLiquidity } from '../useAddLiquidity'
import { PoolActionsPriceImpactDetails } from '../../PoolActionsPriceImpactDetails'

export function AddLiquidityPreview() {
  const { humanAmountsIn, totalUSDValue, tokens, simulationQuery } = useAddLiquidity()
  const { pool } = usePool()
  const { toCurrency } = useCurrency()

  const bptOut = simulationQuery?.data?.bptOut
  const bptOutLabel = bptOut ? formatUnits(bptOut.amount, BPT_DECIMALS) : '0'

  return (
    <VStack spacing="sm" align="start">
      <Card variant="modalSubSection">
        <VStack align="start" spacing="md">
          <HStack justify="space-between" w="full">
            <Text color="grayText">{"You're adding"}</Text>
            <Text>{toCurrency(totalUSDValue, { abbreviated: false })}</Text>
          </HStack>
          {tokens.map(token => {
            if (!token) return <div>Missing token</div>

            const amountIn = humanAmountsIn.find(amountIn =>
              isSameAddress(amountIn.tokenAddress, token?.address as Address)
            ) as HumanAmountIn

            if (!amountIn) return <div key={token.address}>Missing amount in</div>

            return (
              <TokenRow
                key={token.address}
                value={amountIn.humanAmount}
                address={amountIn.tokenAddress}
                chain={pool.chain}
                abbreviated={false}
              />
            )
          })}
        </VStack>
      </Card>

      <Card variant="modalSubSection">
        <VStack align="start" spacing="md">
          <HStack justify="space-between" w="full">
            <Text color="grayText">{"You'll get (if no slippage)"}</Text>
          </HStack>
          <TokenRow
            value={bptOutLabel}
            address={pool.address as Address}
            chain={pool.chain}
            abbreviated={false}
            isBpt={true}
            pool={pool}
          />
        </VStack>
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
