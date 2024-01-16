import { Card, HStack, VStack, Text, Grid, GridItem } from '@chakra-ui/react'
import { PoolListItem } from '../../pool.types'
import { fNum } from '@/lib/shared/utils/numbers'
import AprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/AprTooltip'
import { ReactNode, memo } from 'react'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { usePoolListQueryState } from '../usePoolListQueryState'
import { TokenIconStack } from '@/lib/modules/tokens/TokenIconStack'
import {
  getAprLabel,
  getPoolTypeLabel,
  cardClickHandler,
  cardMouseEnterHandler,
} from '../../pool.utils'
import { useRouter } from 'next/navigation'

interface Props {
  pool: PoolListItem
}

function PoolNameLabel({ pool }: { pool: PoolListItem }) {
  if (pool) {
    const displayTokens = pool.displayTokens
    return (
      <Text fontWeight="bold" noOfLines={2} h="12">
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

function StatCard({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Card h="full" variant="gradient" p="sm">
      <VStack alignItems="flex-start" w="full" gap="0">
        <Text fontWeight="medium" variant="secondary" fontSize="sm">
          {label}
        </Text>
        <Text fontWeight="bold">{value}</Text>
      </VStack>
    </Card>
  )
}

const MemoizedAprTooltip = memo(AprTooltip)

export function PoolListCard({ pool }: Props) {
  const { toCurrency } = useCurrency()
  const { userAddress } = usePoolListQueryState()
  const router = useRouter()

  return (
    <Card
      variant="gradient"
      cursor="pointer"
      onClick={event => cardClickHandler(event, pool.id, pool.chain, router)}
      onMouseEnter={event => cardMouseEnterHandler(event, pool.id, pool.chain, router)}
      p="md"
    >
      <VStack alignItems="flex-start" h="full">
        <HStack alignItems="flex-start">
          <NetworkIcon chain={pool.chain} />
          <VStack alignItems="flex-start" gap="0" w="full">
            <Text fontWeight="medium" variant="secondary" fontSize="sm">
              {getPoolTypeLabel(pool.type)}
            </Text>
            <PoolNameLabel pool={pool} />
          </VStack>
        </HStack>
        <TokenIconStack tokens={pool.displayTokens} chain={pool.chain} pb="lg" />
        <Grid w="full" h="full" templateColumns="1fr 1fr" templateRows="1fr 1fr" gap="sm">
          <GridItem>
            <StatCard label="TVL" value={toCurrency(pool.dynamicData.totalLiquidity)} />
          </GridItem>
          <GridItem>
            <StatCard label="Volume(24h)" value={toCurrency(pool.dynamicData.volume24h)} />
          </GridItem>
          <GridItem>
            <StatCard
              label="My Liquidity"
              value={
                userAddress
                  ? toCurrency(pool.userBalance?.totalBalanceUsd || '0', { abbreviated: false })
                  : '-'
              }
            />
          </GridItem>
          <GridItem>
            <StatCard
              label={
                <HStack>
                  <span>APR</span>
                  <MemoizedAprTooltip
                    data={pool.dynamicData.apr}
                    poolId={pool.id}
                    textProps={{ fontSize: '1rem', fontWeight: 'bold' }}
                    onlySparkles
                  />
                </HStack>
              }
              value={<Text fontSize="sm">{getAprLabel(pool.dynamicData.apr.apr)}</Text>}
            />
          </GridItem>
        </Grid>
      </VStack>
    </Card>
  )
}
