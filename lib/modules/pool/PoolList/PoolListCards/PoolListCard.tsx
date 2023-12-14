import { Card, HStack, VStack, Text, Grid, GridItem } from '@chakra-ui/react'
import { DecoratedPoolListItem, poolTypeHash } from '../../pool.types'
import { fNum } from '@/lib/shared/utils/numbers'
import AprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/AprTooltip'
import { memo } from 'react'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { usePoolListQueryState } from '../usePoolListQueryState'
import { TokenIconStack } from '@/lib/modules/tokens/TokenIconStack'

interface Props {
  pool: DecoratedPoolListItem
  cardClickHandler?: (event: React.MouseEvent<HTMLElement>, pool: DecoratedPoolListItem) => void
  cardMouseEnterHandler?: (
    event: React.MouseEvent<HTMLElement>,
    pool: DecoratedPoolListItem
  ) => void
}

function PoolNameLabel({ pool }: { pool: DecoratedPoolListItem }) {
  if (pool) {
    const displayTokens = pool.displayTokens
    return (
      <Text fontWeight="bold" noOfLines={1}>
        {displayTokens.map((token, idx) => {
          return (
            <>
              {token.nestedTokens ? token.name : token.symbol}
              {token.weight && ` ${fNum('weight', token.weight || '')}`}
              {idx <= displayTokens.length - 2 && ' / '}
            </>
          )
        })}
      </Text>
    )
  }
}

const MemoizedAprTooltip = memo(AprTooltip)

export function PoolListCard({ pool, cardClickHandler, cardMouseEnterHandler }: Props) {
  const { toCurrency } = useCurrency()
  const { userAddress } = usePoolListQueryState()

  return (
    <Card
      variant="gradient"
      onClick={event => cardClickHandler && cardClickHandler(event, pool)}
      cursor={cardClickHandler ? 'pointer' : 'default'}
      onMouseEnter={event => cardMouseEnterHandler && cardMouseEnterHandler(event, pool)}
      p="md"
    >
      <VStack alignItems="flex-start" h="full">
        <HStack alignItems="flex-start">
          <NetworkIcon chain={pool.chain} />
          <VStack alignItems="flex-start" gap="0" w="full">
            <Text fontWeight="medium" variant="secondary" fontSize="sm">
              {poolTypeHash[pool.type]}
            </Text>
            <PoolNameLabel pool={pool} />
          </VStack>
        </HStack>
        <TokenIconStack tokens={pool.displayTokens} chain={pool.chain} />
        <Grid w="full" h="full" templateColumns="1fr 1fr" templateRows="1fr 1fr" gap="4">
          <GridItem>
            <Card h="full" variant="gradient">
              <VStack alignItems="flex-start" w="full" p="md" gap="0">
                <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                  TVL:
                </Text>
                <Text fontWeight="bold" fontSize="1rem">
                  {toCurrency(pool.dynamicData.totalLiquidity)}
                </Text>
              </VStack>
            </Card>
          </GridItem>
          <GridItem>
            <Card h="full" variant="gradient">
              <VStack alignItems="flex-start" w="full" p="md" gap="0">
                <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                  Vol(24h):
                </Text>
                <Text fontWeight="bold" fontSize="1rem">
                  {toCurrency(pool.dynamicData.volume24h)}
                </Text>
              </VStack>
            </Card>
          </GridItem>
          <GridItem>
            <Card h="full" variant="gradient">
              <VStack alignItems="flex-start" w="full" p="md" gap="0">
                <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                  APR:
                </Text>
                <MemoizedAprTooltip
                  data={pool.dynamicData.apr}
                  poolId={pool.id}
                  textProps={{ fontSize: '1rem', fontWeight: 'bold' }}
                />
              </VStack>
            </Card>
          </GridItem>
          {userAddress && (
            <GridItem>
              <Card h="full" variant="gradient">
                <VStack alignItems="flex-start" w="full" p="md" gap="0">
                  <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                    My Liquidity:
                  </Text>
                  <Text fontWeight="bold" fontSize="1rem">
                    {toCurrency(pool.userBalance?.totalBalanceUsd || 0, { abbreviated: false })}
                  </Text>
                </VStack>
              </Card>
            </GridItem>
          )}
        </Grid>
      </VStack>
    </Card>
  )
}
