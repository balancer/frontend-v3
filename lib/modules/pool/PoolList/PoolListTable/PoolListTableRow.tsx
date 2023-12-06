import { Box, Grid, GridItem, GridProps, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { getPoolPath } from '../../pool.utils'
import { DecoratedPoolListItem } from '../../pool.types'
import AprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/AprTooltip'
import { memo } from 'react'
import { PoolListTokensTag } from '../PoolListTokensTag'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

interface Props extends GridProps {
  pool: DecoratedPoolListItem
  keyValue: number
}

const MemoizedAprTooltip = memo(AprTooltip)

export function PoolListTableRow({ pool, keyValue, ...rest }: Props) {
  const { toCurrency } = useCurrency()

  return (
    <Box key={keyValue}>
      <Link href={getPoolPath({ id: pool.id, chain: pool.chain })} prefetch={true}>
        <Grid
          {...rest}
          height="63.5px"
          gridTemplateAreas={`"network details my_liquidity tvl volume apr"`}
        >
          <GridItem area="network">
            <NetworkIcon chain={pool.chain} />
          </GridItem>
          <GridItem area="details">{pool && <PoolListTokensTag pool={pool} />}</GridItem>
          <GridItem area="my_liquidity">
            <Text textAlign="right">
              {toCurrency(pool.userBalance?.totalBalanceUsd || 0, { abbreviated: false })}
            </Text>
          </GridItem>
          <GridItem area="tvl">
            <Text
              title={toCurrency(pool.dynamicData.totalLiquidity, { abbreviated: false })}
              textAlign="right"
            >
              {toCurrency(pool.dynamicData.totalLiquidity)}
            </Text>
          </GridItem>
          <GridItem area="volume" textAlign="right">
            <Text
              title={toCurrency(pool.dynamicData.volume24h, { abbreviated: false })}
              textAlign="right"
            >
              {toCurrency(pool.dynamicData.volume24h)}
            </Text>
          </GridItem>
          <GridItem area="apr" justifySelf="end">
            <MemoizedAprTooltip data={pool.dynamicData.apr} poolId={pool.id} />
          </GridItem>
        </Grid>
      </Link>
    </Box>
  )
}
