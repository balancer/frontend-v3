import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { fNum } from '@/lib/shared/utils/numbers'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { HStack, VStack, Text, Tooltip, Box } from '@chakra-ui/react'
import { usePriceImpact } from '@/lib/shared/hooks/usePriceImpact'
import { useEffect } from 'react'
import { useAddLiquidity } from './useAddLiquidity'
import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'

export function AddLiquidityDetails() {
  const { slippage, slippageDecimal } = useUserSettings()
  const { priceImpactQuery } = useAddLiquidity()

  const { priceImpactLevel, priceImpactColor, getPriceImpactIcon, setPriceImpact, priceImpact } =
    usePriceImpact()

  const priceImpactLabel = priceImpact ? fNum('priceImpact', priceImpact) : '-'

  useEffect(() => {
    if (priceImpactQuery) {
      setPriceImpact(priceImpactQuery.data ?? '-1')
    }
  }, [priceImpactQuery])

  return (
    <VStack spacing="sm" align="start" w="full" fontSize="sm">
      <HStack justify="space-between" w="full">
        <Text color={priceImpactColor}>Price impact</Text>
        <HStack>
          {priceImpactLevel === 'unknown' ? (
            <Text>Unknown</Text>
          ) : (
            <NumberText color={priceImpactColor}>{priceImpactLabel}</NumberText>
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
    </VStack>
  )
}
