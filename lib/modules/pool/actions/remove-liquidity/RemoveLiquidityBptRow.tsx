import { HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { TokenIcon } from '@/lib/modules/tokens/TokenIcon'
import { fNum } from '@/lib/shared/utils/numbers'

type Props = {
  pool: any
  bptPrice: number
  amount: number
}

export default function RemoveLiquidityBptRow({ pool, bptPrice, amount }: Props) {
  const { toCurrency } = useCurrency()
  const totalValue = amount * bptPrice

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
            {fNum('token', amount) || 0.0}
          </Heading>
          <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
            {toCurrency(totalValue)}
          </Text>
        </VStack>
        {/* TODO: add percentages */}
      </HStack>
    </HStack>
  )
}
