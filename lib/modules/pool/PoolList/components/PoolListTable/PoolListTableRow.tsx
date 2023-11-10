import { Box, BoxProps, Grid, GridItem, Text } from '@chakra-ui/react'
import Link from 'next/link'
import numeral from 'numeral'
import { getPoolPath } from '@/lib/modules/pool/pool.utils'
import { getNetworkConfig } from '@/lib/config/app.config'
import Image from 'next/image'
import { PoolListItem } from '@/lib/modules/pool/pool.types'
//import AprTooltip from '~/components/apr-tooltip/AprTooltip';

interface Props extends BoxProps {
  pool: PoolListItem
}

export function PoolListTableRow({ pool, ...rest }: Props) {
  const networkConfig = getNetworkConfig(pool.chain)
  return (
    <Box {...rest}>
      <Link href={getPoolPath({ id: pool.id, chain: pool.chain })} prefetch={true}>
        <Grid
          pl="4"
          height="63.5px"
          gridTemplateColumns={'50px 1fr 200px 200px 200px'}
          gap="0"
          gridTemplateAreas={`"network details tvl volume apr"`}
          alignItems="center"
        >
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
          <GridItem area="apr" textAlign="right">
            APR
            {/* <MemoizedAprTooltip
                                data={pool.dynamicData.apr}
                                textProps={{ fontWeight: 'normal', fontSize: { base: 'xl', lg: 'md' } }}
                                poolId={pool.id}
                            /> */}
          </GridItem>
        </Grid>
      </Link>
    </Box>
  )
}
