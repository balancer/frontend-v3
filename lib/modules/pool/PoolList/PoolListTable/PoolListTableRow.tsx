import { Box, Grid, GridItem, GridProps, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { getPoolPath } from '../../pool.utils'
import { getNetworkConfig } from '@/lib/config/app.config'
import Image from 'next/image'
import { PoolListItem } from '../../pool.types'
import AprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/AprTooltip'
import { memo } from 'react'
import { useNumbers } from '@/lib/shared/hooks/useNumbers'
import { PoolListTokensTag } from '../PoolListTokensTag'

interface Props extends GridProps {
  pool: PoolListItem
  keyValue: number
}

const MemoizedAprTooltip = memo(AprTooltip)

export function PoolListTableRow({ pool, keyValue, ...rest }: Props) {
  const networkConfig = getNetworkConfig(pool.chain)
  const { toCurrency } = useNumbers()

  return (
    <Box key={keyValue}>
      <Link href={getPoolPath({ id: pool.id, chain: pool.chain })} prefetch={true}>
        <Grid {...rest} minH="63.5px" gridTemplateAreas={`"network details tvl volume apr"`}>
          <GridItem area="network">
            <Image
              src={networkConfig.iconPath}
              width="30"
              height="30"
              alt={networkConfig.shortName}
            />
          </GridItem>
          <GridItem area="details">{pool && <PoolListTokensTag pool={pool} />}</GridItem>
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
