import { Box, Grid, GridItem, GridProps, HStack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import MainAprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/MainAprTooltip'
import { memo } from 'react'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { PoolListItem } from '../../pool/pool.types'
import { getPoolPath, getPoolTypeLabel } from '../../pool/pool.utils'
import { PoolListTokenPills } from '../../pool/PoolList/PoolListTokenPills'
import { bn } from '@/lib/shared/utils/numbers'
import {
  calcTotalStakedBalance,
  getUserTotalBalanceUsd,
  hasAuraStakedBalance,
  hasBalancerStakedBalance,
} from '../../pool/user-balance.helpers'
import { ProtocolIcon } from '@/lib/shared/components/icons/ProtocolIcon'
import { Protocol } from '../../protocols/useProtocols'

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
      <Link href={getPoolPath(pool)} prefetch={true}>
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
          <GridItem display="flex" justifyContent="right">
            <HStack>
              <Text textAlign="right" fontWeight="medium">
                {bn(calcTotalStakedBalance(pool)).isGreaterThan(0) ? 'Staked' : 'N/A'}{' '}
              </Text>
              <StakingIcons pool={pool} />
            </HStack>
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
              {toCurrency(getUserTotalBalanceUsd(pool), { abbreviated: false })}
            </Text>
          </GridItem>
          <GridItem justifySelf="end">
            <MemoizedMainAprTooltip
              aprItems={pool.dynamicData.aprItems}
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

function StakingIcons({ pool }: { pool: PoolListItem }) {
  return (
    <>
      {hasAuraStakedBalance(pool) && <ProtocolIcon protocol={Protocol.Aura} />}
      {hasBalancerStakedBalance(pool) && <ProtocolIcon protocol={Protocol.Balancer} />}
    </>
  )
}
