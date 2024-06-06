import { Box, Grid, GridItem, GridProps, Text } from '@chakra-ui/react'
import Link from 'next/link'
import MainAprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/MainAprTooltip'
import { memo } from 'react'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { PoolListItem } from '../../pool/pool.types'
import { getPoolPath, getPoolTypeLabel } from '../../pool/pool.utils'
import { PoolListTokenPills } from '../../pool/PoolList/PoolListTokenPills'
import { bn } from '@/lib/shared/utils/numbers'

interface Props extends GridProps {
  pool: PoolListItem
  keyValue: number
  veBalBoostMap: Record<string, string>
}

const MemoizedMainAprTooltip = memo(MainAprTooltip)

export function PortfolioTableRow({ pool, keyValue, veBalBoostMap, ...rest }: Props) {
  const { toCurrency } = useCurrency()
  const vebalBoostValue = veBalBoostMap?.[pool.id]

  return (
    <Box
      key={keyValue}
      transition="all 0.2s ease-in-out"
      _hover={{
        bg: 'background.base',
      }}
      rounded="md"
      px={{ base: 'ms', sm: '0' }}
      w="full"
    >
      <Link href={getPoolPath({ id: pool.id, chain: pool.chain })} prefetch={true}>
        <Grid {...rest} py="sm">
          <GridItem>
            <NetworkIcon chain={pool.chain} size={6} />
          </GridItem>
          <GridItem>
            <PoolListTokenPills
              pool={pool}
              h={['32px', '36px']}
              p={['xxs', 'sm']}
              pr={[1.5, 'ms']}
              iconSize={20}
            />
          </GridItem>
          <GridItem>
            <Text textAlign="left" fontWeight="medium" textTransform="capitalize">
              {getPoolTypeLabel(pool.type)}
            </Text>
          </GridItem>
          <GridItem>
            <Text textAlign="right" fontWeight="medium">
              {bn(pool.userBalance?.stakedBalance || 0).isGreaterThan(0) ? 'Staked' : 'N/A'}
            </Text>
          </GridItem>
          {/* TO-DO vebal boost */}
          <GridItem textAlign="right">
            <Text
              title={toCurrency(pool.dynamicData.volume24h, { abbreviated: false })}
              textAlign="right"
              fontWeight="medium"
            >
              {vebalBoostValue ? `${Number(vebalBoostValue).toFixed(2)}x` : '-'}
            </Text>
          </GridItem>
          <GridItem>
            <Text textAlign="right" fontWeight="medium">
              {toCurrency(pool.userBalance?.totalBalanceUsd || '0', { abbreviated: false })}
            </Text>
          </GridItem>
          <GridItem justifySelf="end">
            <MemoizedMainAprTooltip
              data={pool.dynamicData.apr}
              poolId={pool.id}
              textProps={{ fontWeight: 'medium' }}
              vebalBoost={vebalBoostValue}
            />
          </GridItem>
        </Grid>
      </Link>
    </Box>
  )
}
