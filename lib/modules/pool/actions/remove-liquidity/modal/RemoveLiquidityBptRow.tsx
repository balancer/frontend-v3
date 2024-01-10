import { TokenIcon } from '@/lib/modules/tokens/TokenIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { fNum } from '@/lib/shared/utils/numbers'
import { HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { Pool } from '../../../usePool'
import { useRemoveLiquidity } from '../useRemoveLiquidity'

type Props = {
  pool: Pool
}

export default function RemoveLiquidityBptRow({ pool }: Props) {
  const { toCurrency } = useCurrency()
  const { humanBptIn, totalUsdValue, totalUsdFromBprPrice } = useRemoveLiquidity()

  return (
    <HStack width="full" justifyContent="space-between">
      <HStack>
        <TokenIcon chain={pool.chain} address={pool.address} size={32} alt={pool.symbol} />
        <VStack spacing="1" alignItems="flex-start">
          <Heading fontWeight="bold" as="h6" fontSize="1rem">
            {pool.symbol}
          </Heading>
          <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
            {pool.name}
          </Text>
        </VStack>
      </HStack>
      <HStack spacing="8">
        <VStack spacing="1" alignItems="flex-end">
          <Heading fontWeight="bold" as="h6" fontSize="1rem">
            {fNum('token', humanBptIn) || 0.0}
          </Heading>
          <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
            {toCurrency(totalUsdFromBprPrice)}
          </Text>
          <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
            {toCurrency(totalUsdValue)}
          </Text>
        </VStack>
        {/* TODO: add percentages */}
      </HStack>
    </HStack>
  )
}
