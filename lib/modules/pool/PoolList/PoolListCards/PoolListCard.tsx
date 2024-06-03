import { Card, HStack, VStack, Text, Grid, GridItem } from '@chakra-ui/react'
import { PoolListItem } from '../../pool.types'
import MainAprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/MainAprTooltip'
import { ReactNode, isValidElement, memo } from 'react'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { usePoolListQueryState } from '../usePoolListQueryState'
import { TokenIconStack } from '@/lib/modules/tokens/TokenIconStack'
import {
  getAprLabel,
  getPoolTypeLabel,
  poolClickHandler,
  poolMouseEnterHandler,
} from '../../pool.utils'
import { useRouter } from 'next/navigation'
import { PoolName } from '../../PoolName'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'

interface Props {
  pool: PoolListItem
}

function StatCard({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Card h="full" variant="gradient" p="sm">
      <VStack alignItems="flex-start" w="full" gap="0">
        {isValidElement(label) ? (
          label
        ) : (
          <Text fontWeight="medium" variant="secondary" fontSize="sm">
            {label}
          </Text>
        )}
        {isValidElement(value) ? value : <Text fontWeight="bold">{value}</Text>}
      </VStack>
    </Card>
  )
}

const MemoizedMainAprTooltip = memo(MainAprTooltip)

export function PoolListCard({ pool }: Props) {
  const { toCurrency } = useCurrency()
  const { userAddress } = usePoolListQueryState()
  const router = useRouter()

  return (
    <FadeInOnView animateOnce={false}>
      <Card
        variant="gradient"
        cursor="pointer"
        onClick={event => poolClickHandler(event, pool.id, pool.chain, pool.type, router)}
        onMouseEnter={event => poolMouseEnterHandler(event, pool.id, pool.chain, pool.type, router)}
        p="md"
      >
        <VStack alignItems="flex-start" h="full">
          <HStack alignItems="flex-start">
            <NetworkIcon chain={pool.chain} />
            <VStack alignItems="flex-start" gap="0" w="full">
              <Text fontWeight="medium" variant="secondary" fontSize="sm">
                {getPoolTypeLabel(pool.type)}
              </Text>
              <PoolName pool={pool} fontWeight="bold" noOfLines={2} h="12" />
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
                    <Text fontWeight="medium" variant="secondary" fontSize="sm">
                      APR
                    </Text>
                    <MemoizedMainAprTooltip
                      data={pool.dynamicData.apr}
                      poolId={pool.id}
                      textProps={{ fontSize: '1rem', fontWeight: 'bold' }}
                      onlySparkles
                    />
                  </HStack>
                }
                value={
                  <Text fontWeight="bold" fontSize="sm">
                    {getAprLabel(pool.dynamicData.apr.apr)}
                  </Text>
                }
              />
            </GridItem>
          </Grid>
        </VStack>
      </Card>
    </FadeInOnView>
  )
}
