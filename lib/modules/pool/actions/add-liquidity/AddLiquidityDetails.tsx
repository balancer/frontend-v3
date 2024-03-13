import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { fNum, safeTokenFormat, bn } from '@/lib/shared/utils/numbers'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { HStack, VStack, Text, Tooltip, Box } from '@chakra-ui/react'
import { usePriceImpact } from '@/lib/shared/hooks/usePriceImpact'
import { useEffect } from 'react'
import { useAddLiquidity } from './useAddLiquidity'
import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { BPT_DECIMALS } from '../../pool.constants'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { usePool } from '../../usePool'
import { parseUnits } from 'viem'

export function AddLiquidityDetails() {
  const { slippage } = useUserSettings()
  const { priceImpactQuery, simulationQuery, totalUSDValue } = useAddLiquidity()
  const { toCurrency } = useCurrency()
  const { pool } = usePool()

  const { priceImpactLevel, priceImpactColor, getPriceImpactIcon, setPriceImpact, priceImpact } =
    usePriceImpact()

  const priceImpactLabel = priceImpact ? fNum('priceImpact', priceImpact) : '-'

  const bptOut = simulationQuery?.data?.bptOut
  const bptOutLabel = safeTokenFormat(bptOut?.amount, BPT_DECIMALS, { abbreviated: false })

  const priceImpacUsd = bn(priceImpact || 0).times(totalUSDValue)
  const maxSlippageUsd = bn(slippage).div(100).times(totalUSDValue)

  const shareOfPool = bn(bptOut?.amount || 0).div(bn(parseUnits(pool.dynamicData.totalShares, 18)))

  useEffect(() => {
    if (priceImpactQuery) {
      setPriceImpact(priceImpactQuery.data ?? '-1')
    }
  }, [priceImpactQuery])

  return (
    <VStack spacing="sm" align="start" w="full" fontSize="sm">
      <HStack justify="space-between" w="full">
        <Text color="grayText">Expected LP tokens</Text>
        <HStack>
          <NumberText color="grayText">{bptOutLabel}</NumberText>
          <Tooltip
            label={`LP tokens you are expected to receive. Does not include potential slippage (${fNum(
              'slippage',
              slippage
            )}).`}
            fontSize="sm"
          >
            <InfoOutlineIcon color="grayText" />
          </Tooltip>
        </HStack>
      </HStack>
      <HStack justify="space-between" w="full">
        <Text color="grayText">Price impact</Text>
        <HStack>
          {priceImpactLevel === 'unknown' ? (
            <Text>Unknown</Text>
          ) : (
            <NumberText color={priceImpactColor}>
              {toCurrency(priceImpacUsd, { abbreviated: false })} ({priceImpactLabel})
            </NumberText>
          )}
          <Tooltip label="Price impact" fontSize="sm">
            {priceImpactLevel === 'low' ? (
              <InfoOutlineIcon color="grayText" />
            ) : (
              <Box color={priceImpactColor}>{getPriceImpactIcon(priceImpactLevel)}</Box>
            )}
          </Tooltip>
        </HStack>
      </HStack>
      <HStack justify="space-between" w="full">
        <Text color="grayText">Max slippage</Text>
        <HStack>
          <NumberText color="grayText">
            {toCurrency(maxSlippageUsd, { abbreviated: false })} ({fNum('slippage', slippage)})
          </NumberText>
          <Tooltip label="Max slippage" fontSize="sm">
            <InfoOutlineIcon color="grayText" />
          </Tooltip>
        </HStack>
      </HStack>
      <HStack justify="space-between" w="full">
        <Text color="grayText">Share of pool</Text>
        <HStack>
          <NumberText color="grayText">{fNum('sharePercent', shareOfPool)}</NumberText>
          <Tooltip label="Share of pool" fontSize="sm">
            <InfoOutlineIcon color="grayText" />
          </Tooltip>
        </HStack>
      </HStack>
    </VStack>
  )
}
