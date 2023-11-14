import { Box, Grid, GridItem, GridProps, Text } from '@chakra-ui/react'
import Link from 'next/link'
import numeral from 'numeral'
import { getPoolPath } from '@/lib/modules/pool/pool.utils'
import { getNetworkConfig } from '@/lib/config/app.config'
import Image from 'next/image'
import { PoolListItem } from '@/lib/modules/pool/pool.types'
import AprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/AprTooltip'
import { memo } from 'react'

interface Props extends GridProps {
  pool: PoolListItem
  key: number
}

const MemoizedAprTooltip = memo(AprTooltip)

export function PoolListTableRow({ pool, key, ...rest }: Props) {
  const networkConfig = getNetworkConfig(pool.chain)
  return (
    <Box key={key}>
      <Link href={getPoolPath({ id: pool.id, chain: pool.chain })} prefetch={true}>
        <Grid {...rest} height="63.5px" gridTemplateAreas={`"network details tvl volume apr"`}>
          <GridItem area="network">
            <Image
              src={networkConfig.iconPath}
              width="30"
              height="30"
              alt={networkConfig.shortName}
            />
          </GridItem>
          <GridItem area="details">
            <Text>{pool.name}</Text>
          </GridItem>
          <GridItem area="tvl">
            <Text textAlign="right">{numeral(pool.dynamicData.totalLiquidity).format('$0,0')}</Text>
          </GridItem>
          <GridItem area="volume" textAlign="right">
            <Text>{numeral(pool.dynamicData.volume24h).format('$0,0')}</Text>
          </GridItem>
          <GridItem area="apr" justifySelf="end">
            <MemoizedAprTooltip data={pool.dynamicData.apr} poolId={pool.id} />
          </GridItem>
        </Grid>
      </Link>
    </Box>
  )
}
