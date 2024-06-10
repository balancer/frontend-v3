import { Card, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import BaseAprTooltip from './BaseAprTooltip'
import StarsIcon from '../../icons/StarsIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useCallback } from 'react'
import { bn } from '@/lib/shared/utils/numbers'
import BigNumber from 'bignumber.js'
import { Pool } from '@/lib/modules/pool/PoolProvider'
import { calcPotentialYieldFor } from '@/lib/modules/pool/pool.utils'

interface Props {
  totalUsdValue: string
  pool: Pool
}

function StakeAprTooltip({ pool, totalUsdValue }: Props) {
  const weeklyYield = calcPotentialYieldFor(pool, totalUsdValue)

  const { toCurrency } = useCurrency()

  const numberFormatter = useCallback(
    (value: string) =>
      bn(bn(value).times(totalUsdValue).dividedBy(52).toFixed(2, BigNumber.ROUND_HALF_UP)),
    [totalUsdValue]
  )

  const displayValueFormatter = useCallback(
    (value: BigNumber) => toCurrency(value.toString(), { abbreviated: false }),
    [toCurrency]
  )

  return (
    <BaseAprTooltip
      data={pool.dynamicData.apr}
      totalBaseText="Total weekly base"
      maxVeBalText="Total with max veBAL"
      placement="top-start"
      vebalBoost="1"
      numberFormatter={numberFormatter}
      displayValueFormatter={displayValueFormatter}
      shouldDisplayBaseTooltip
      shouldDisplayMaxVeBalTooltip
    >
      <Card cursor="pointer" variant="subSection" w="full">
        <VStack align="start" w="full" spacing="sm">
          <Text>Potential yield (1w)</Text>
          <HStack>
            <Text variant="special" fontSize="lg" fontWeight="bold">
              {weeklyYield ? toCurrency(weeklyYield, { abbreviated: false }) : '-'}
            </Text>
            <Icon as={StarsIcon} />
          </HStack>
        </VStack>
      </Card>
    </BaseAprTooltip>
  )
}

export default StakeAprTooltip
