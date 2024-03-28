'use client'

import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { fNum } from '@/lib/shared/utils/numbers'
import { isSameAddress } from '@balancer/sdk'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Card, HStack, Skeleton, Text, Tooltip, VStack } from '@chakra-ui/react'
import { Address, formatUnits } from 'viem'
import { BPT_DECIMALS } from '../../../pool.constants'
import { usePool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { useAddLiquidity } from '../useAddLiquidity'
import { AddLiquidityTimeout } from './AddLiquidityTimeout'

export function AddLiquidityPreview() {
  const { humanAmountsIn, totalUSDValue, priceImpactQuery, tokens, simulationQuery } =
    useAddLiquidity()
  const { pool } = usePool()
  const { toCurrency } = useCurrency()
  const { slippage } = useUserSettings()

  const bptOut = simulationQuery?.data?.bptOut
  const bptOutLabel = bptOut ? formatUnits(bptOut.amount, BPT_DECIMALS) : '0'

  const priceImpact = priceImpactQuery?.data
  const priceImpactLabel = priceImpact !== undefined ? fNum('priceImpact', priceImpact) : '-'

  return (
    <VStack spacing="md" align="start">
      <Card variant="level3" p="md" shadow="sm" w="full">
        <VStack align="start" spacing="md">
          <HStack justify="space-between" w="full">
            <Text color="grayText">{"You're adding"}</Text>
            <NumberText fontSize="lg">
              {toCurrency(totalUSDValue, { abbreviated: false })}
            </NumberText>
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

      <Card variant="level3" p="md" shadow="sm" w="full">
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

      <Card variant="level2" p="md" shadow="sm" w="full">
        <VStack align="start" spacing="sm">
          <HStack justify="space-between" w="full">
            <Text>Price impact</Text>
            <HStack>
              {priceImpactQuery.isLoading ? (
                <Skeleton w="12" h="full" />
              ) : (
                <NumberText color="grayText">{priceImpactLabel}</NumberText>
              )}
              <Tooltip label="Price impact" fontSize="sm">
                <InfoOutlineIcon color="grayText" />
              </Tooltip>
            </HStack>
          </HStack>
          <HStack justify="space-between" w="full">
            <Text>Max. slippage</Text>
            <HStack>
              <NumberText color="grayText">{fNum('slippage', slippage)}</NumberText>
              <Tooltip
                label="Your maximum slippage setting. This can be changed in your
            transaction settings (top right on previous input form)."
                fontSize="sm"
              >
                <InfoOutlineIcon color="grayText" />
              </Tooltip>
            </HStack>
          </HStack>
          <AddLiquidityTimeout />
        </VStack>
      </Card>
    </VStack>
  )
}
