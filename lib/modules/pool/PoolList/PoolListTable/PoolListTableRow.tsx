import { Box, Grid, GridItem, GridProps, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { getPoolPath } from '../../pool.utils'
import AprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/AprTooltip'
import { memo } from 'react'
import { PoolListTokensTag } from '../PoolListTokensTag'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { usePoolListQueryState } from '../usePoolListQueryState'
import { PoolListItem } from '../../pool.types'

interface Props extends GridProps {
  pool: PoolListItem
  keyValue: number
}

const MemoizedAprTooltip = memo(AprTooltip)

export function PoolListTableRow({ pool, keyValue, ...rest }: Props) {
  const { userAddress } = usePoolListQueryState()
  const { toCurrency } = useCurrency()

  return (
    <Box key={keyValue}>
      <Link href={getPoolPath({ id: pool.id, chain: pool.chain })} prefetch={true}>
        <Grid {...rest} height="63.5px">
          <GridItem>
            <NetworkIcon chain={pool.chain} />
          </GridItem>
          <GridItem>{pool && <PoolListTokensTag pool={pool} />}</GridItem>
          {userAddress && (
            <GridItem>
              <Text textAlign="right">
                {toCurrency(pool.userBalance?.totalBalanceUsd || '0', { abbreviated: false })}
              </Text>
            </GridItem>
          )}
          <GridItem>
            <Text
              title={toCurrency(pool.dynamicData.totalLiquidity, { abbreviated: false })}
              textAlign="right"
            >
              {toCurrency(pool.dynamicData.totalLiquidity)}
            </Text>
          </GridItem>
          <GridItem textAlign="right">
            <Text
              title={toCurrency(pool.dynamicData.volume24h, { abbreviated: false })}
              textAlign="right"
            >
              {toCurrency(pool.dynamicData.volume24h)}
            </Text>
          </GridItem>
          <GridItem justifySelf="end">
            <MemoizedAprTooltip data={pool.dynamicData.apr} poolId={pool.id} />
          </GridItem>
        </Grid>
      </Link>
    </Box>
  )
}
