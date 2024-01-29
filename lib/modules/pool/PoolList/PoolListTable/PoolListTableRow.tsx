import { Box, Grid, GridItem, GridProps, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { getPoolPath } from '../../pool.utils'
import AprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/AprTooltip'
import { memo } from 'react'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { usePoolListQueryState } from '../usePoolListQueryState'
import { PoolListItem } from '../../pool.types'
import { PoolListTokenPills } from '../PoolListTokenPills'

interface Props extends GridProps {
  pool: PoolListItem
  keyValue: number
}

const MemoizedAprTooltip = memo(AprTooltip)

export function PoolListTableRow({ pool, keyValue, ...rest }: Props) {
  const { userAddress } = usePoolListQueryState()
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
          {userAddress && (
            <GridItem>
              <Text textAlign="right" fontWeight="medium">
                {toCurrency(pool.userBalance?.totalBalanceUsd || '0', { abbreviated: false })}
              </Text>
            </GridItem>
          )}
          <GridItem>
            <Text
              title={toCurrency(pool.dynamicData.totalLiquidity, { abbreviated: false })}
              textAlign="right"
              fontWeight="medium"
            >
              {toCurrency(pool.dynamicData.totalLiquidity)}
            </Text>
          </GridItem>
          <GridItem textAlign="right">
            <Text
              title={toCurrency(pool.dynamicData.volume24h, { abbreviated: false })}
              textAlign="right"
              fontWeight="medium"
            >
              {toCurrency(pool.dynamicData.volume24h)}
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
