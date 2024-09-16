import { Box, Grid, GridItem, GridProps, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { getPoolPath, getPoolTypeLabel } from '../../pool.utils'
import MainAprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/MainAprTooltip'
import { memo } from 'react'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { usePoolListQueryState } from '../usePoolListQueryState'
import { PoolListItem } from '../../pool.types'
import { PoolListTokenPills } from '../PoolListTokenPills'
import { getUserTotalBalanceUsd } from '../../user-balance.helpers'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'

interface Props extends GridProps {
  pool: PoolListItem
  keyValue: number
}

const MemoizedMainAprTooltip = memo(MainAprTooltip)

export function PoolListTableRow({ pool, keyValue, ...rest }: Props) {
  const { userAddress } = usePoolListQueryState()
  const { toCurrency } = useCurrency()

  return (
    <FadeInOnView>
      <Box
        _hover={{
          bg: 'background.level0',
        }}
        key={keyValue}
        px={{ base: '0', sm: 'md' }}
        rounded="md"
        transition="all 0.2s ease-in-out"
        w="full"
      >
        <Link href={getPoolPath(pool)} prefetch>
          <Grid {...rest} pr="4" py={{ base: 'ms', md: 'md' }}>
            <GridItem>
              <NetworkIcon chain={pool.chain} size={6} />
            </GridItem>
            <GridItem>
              <PoolListTokenPills
                h={['32px', '36px']}
                iconSize={20}
                p={['xxs', 'sm']}
                pool={pool}
                pr={[1.5, 'ms']}
              />
            </GridItem>
            <GridItem>
              <Text fontWeight="medium" textAlign="left" textTransform="capitalize">
                {getPoolTypeLabel(pool.type)}
              </Text>
            </GridItem>
            {userAddress ? (
              <GridItem>
                <Text fontWeight="medium" textAlign="right">
                  {toCurrency(getUserTotalBalanceUsd(pool), { abbreviated: false })}
                </Text>
              </GridItem>
            ) : null}
            <GridItem>
              <Text
                fontWeight="medium"
                textAlign="right"
                title={toCurrency(pool.dynamicData.totalLiquidity, { abbreviated: false })}
              >
                {toCurrency(pool.dynamicData.totalLiquidity)}
              </Text>
            </GridItem>
            <GridItem textAlign="right">
              <Text
                fontWeight="medium"
                textAlign="right"
                title={toCurrency(pool.dynamicData.volume24h, { abbreviated: false })}
              >
                {toCurrency(pool.dynamicData.volume24h)}
              </Text>
            </GridItem>
            <GridItem justifySelf="end" pr={{ base: 'md', xl: '0' }}>
              <MemoizedMainAprTooltip
                aprItems={pool.dynamicData.aprItems}
                height="auto"
                pool={pool}
                poolId={pool.id}
                textProps={{ fontWeight: 'medium', textAlign: 'right' }}
              />
            </GridItem>
          </Grid>
        </Link>
      </Box>
    </FadeInOnView>
  )
}
