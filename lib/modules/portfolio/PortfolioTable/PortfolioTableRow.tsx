import { Box, Grid, GridItem, GridProps, Text } from '@chakra-ui/react'
import Link from 'next/link'

import AprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/AprTooltip'
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
}

const MemoizedAprTooltip = memo(AprTooltip)

export function PortfolioTableRow({ pool, keyValue, ...rest }: Props) {
  const { toCurrency } = useCurrency()

  return (
    <Box
      key={keyValue}
      transition="all 0.2s ease-in-out"
      _hover={{
        bg: 'background.base',
      }}
      rounded="md"
    >
      <Link href={getPoolPath({ id: pool.id, chain: pool.chain })} prefetch={true}>
        <Grid {...rest} py="sm">
          <GridItem>
            <NetworkIcon chain={pool.chain} size={10} />
          </GridItem>
          <GridItem>
            <PoolListTokenPills pool={pool} />
          </GridItem>

          <GridItem>
            <Text textAlign="right" fontWeight="medium" textTransform="capitalize">
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
              1.5x
            </Text>
          </GridItem>

          <GridItem>
            <Text textAlign="right" fontWeight="medium">
              {toCurrency(pool.userBalance?.totalBalanceUsd || '0', { abbreviated: false })}
            </Text>
          </GridItem>

          <GridItem justifySelf="end">
            <MemoizedAprTooltip
              data={pool.dynamicData.apr}
              poolId={pool.id}
              textProps={{ fontWeight: 'medium' }}
            />
          </GridItem>
        </Grid>
      </Link>
    </Box>
  )
}
