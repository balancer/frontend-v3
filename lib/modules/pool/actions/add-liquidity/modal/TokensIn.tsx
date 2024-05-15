import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { isSameAddress } from '@balancer/sdk'
import { HStack, Skeleton, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'
import { usePool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { useAddLiquidity } from '../useAddLiquidity'
import { useTotalUsdValue } from '../useTotalUsdValue'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

function missingAmountIn(): HumanAmountIn {
  return {
    tokenAddress: '' as Address,
    humanAmount: '',
  }
}

export function TokensIn({
  label,
  amountsIn,
  totalUSDValue,
  chain,
  isLoading,
}: {
  label: string
  amountsIn: HumanAmountIn[]
  totalUSDValue: string
  chain: GqlChain
  isLoading?: boolean
}) {
  const { toCurrency } = useCurrency()

  return (
    <VStack align="start" spacing="md">
      <HStack justify="space-between" w="full">
        <Text color="grayText">{label}</Text>
        {isLoading ? (
          <Skeleton h="5" w="12" />
        ) : (
          <Text>{toCurrency(totalUSDValue, { abbreviated: false })}</Text>
        )}
      </HStack>
      {amountsIn.map(amountIn => {
        if (!amountIn.tokenAddress) return <div key={JSON.stringify(amountIn)}>Missing token</div>

        return (
          <TokenRow
            key={amountIn.tokenAddress}
            value={amountIn.humanAmount}
            address={amountIn.tokenAddress}
            chain={chain}
            abbreviated={false}
            isLoading={isLoading}
          />
        )
      })}
    </VStack>
  )
}

export function ReceiptTokensIn({
  sentTokens,
  isLoading,
}: {
  sentTokens: HumanAmountIn[]
  isLoading?: boolean
}) {
  const { pool } = usePool()
  const { validTokens } = useAddLiquidity()
  const { usdValueFor } = useTotalUsdValue(validTokens)
  const totalUSDValue = usdValueFor(sentTokens)

  return (
    <TokensIn
      label="You added"
      amountsIn={sentTokens}
      totalUSDValue={totalUSDValue}
      chain={pool.chain}
      isLoading={isLoading}
    />
  )
}

export function QuoteTokensIn() {
  const { pool } = usePool()
  const { humanAmountsIn, totalUSDValue, tokens } = useAddLiquidity()

  const amountsIn: HumanAmountIn[] = tokens.map(token => {
    if (!token) return missingAmountIn()

    const amountIn = humanAmountsIn.find(amountIn =>
      isSameAddress(amountIn.tokenAddress, token.address as Address)
    ) as HumanAmountIn
    return amountIn
  })

  return (
    <TokensIn
      label="You're adding"
      amountsIn={amountsIn}
      totalUSDValue={totalUSDValue}
      chain={pool.chain}
    />
  )
}
