import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { fNum, safeTokenFormat, bn } from '@/lib/shared/utils/numbers'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { HStack, VStack, Text, Tooltip, Icon } from '@chakra-ui/react'
import { usePriceImpact } from '@/lib/shared/hooks/usePriceImpact'
import { useEffect, useState } from 'react'
import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { BPT_DECIMALS } from '../pool.constants'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { usePool } from '../usePool'
import { parseUnits } from 'viem'
import { ArrowRight } from 'react-feather'

interface PoolActionsPriceImpactDetailsProps {
  bptAmount: bigint | undefined
  priceImpactValue: number | undefined
  totalUSDValue: string
  isAddLiquidity?: boolean
}

export function PoolActionsPriceImpactDetails({
  bptAmount,
  priceImpactValue,
  totalUSDValue,
  isAddLiquidity = false,
}: PoolActionsPriceImpactDetailsProps) {
  const [userTotalBalance, setUserTotalBalance] = useState('0')

  const { slippage } = useUserSettings()
  const { toCurrency } = useCurrency()
  const { pool } = usePool()

  const { priceImpactLevel, priceImpactColor, getPriceImpactIcon, setPriceImpact, priceImpact } =
    usePriceImpact()

  const priceImpactLabel = priceImpact ? fNum('priceImpact', priceImpact) : '-'

  const bptLabel = safeTokenFormat(bptAmount, BPT_DECIMALS, { abbreviated: false })

  const priceImpacUsd = bn(priceImpact || 0).times(totalUSDValue)
  const maxSlippageUsd = bn(slippage).div(100).times(totalUSDValue)

  const changedShareOfPool = bn(bptAmount || 0).div(
    bn(parseUnits(pool.dynamicData.totalShares, 18))
  )
  const currentShareOfPool = bn(parseUnits(userTotalBalance, 18)).div(
    bn(parseUnits(pool.dynamicData.totalShares, 18))
  )
  const futureShareOfPool = isAddLiquidity
    ? currentShareOfPool.plus(changedShareOfPool)
    : currentShareOfPool.minus(changedShareOfPool)

  useEffect(() => {
    if (pool.userBalance) {
      setUserTotalBalance(pool.userBalance.totalBalance)
    }
  }, [pool])

  useEffect(() => {
    if (priceImpactValue) {
      setPriceImpact(priceImpactValue ?? '-1')
    }
  }, [priceImpactValue])

  return (
    <VStack spacing="sm" align="start" w="full" fontSize="sm">
      <HStack justify="space-between" w="full">
        <Text color="grayText">Expected LP tokens</Text>
        <HStack>
          <NumberText color="grayText">{bptLabel}</NumberText>
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
              getPriceImpactIcon(priceImpactLevel)
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
          <HStack gap="0.5">
            <NumberText color="grayText">{fNum('sharePercent', currentShareOfPool)}</NumberText>
            <Icon as={ArrowRight} color="grayText" />
            <NumberText color="grayText">{fNum('sharePercent', futureShareOfPool)}</NumberText>
          </HStack>
          <Tooltip label="Share of pool" fontSize="sm">
            <InfoOutlineIcon color="grayText" />
          </Tooltip>
        </HStack>
      </HStack>
    </VStack>
  )
}
