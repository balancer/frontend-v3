import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { isSameAddress } from '@balancer/sdk'
import { Card, HStack, Text, VStack } from '@chakra-ui/react'
import { Address, Hash } from 'viem'
import { usePool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { useAddLiquidity } from '../useAddLiquidity'
import { useTotalUsdValue } from '../useTotalUsdValue'
// eslint-disable-next-line max-len
import { useAddLiquidityReceipt } from '@/app/(app)/pools/[chain]/[variant]/[id]/add-liquidity/[hash]/useTransactionLogsQuery'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useReceipt } from '../../../../transactions/transaction-steps/useReceipt'

function missingAmountIn(): HumanAmountIn {
  return {
    tokenAddress: '' as Address,
    humanAmount: '',
  }
}

export function TokensInCardFromReceipt() {
  const { isLoading: isLoadingUserAccount, userAddress } = useUserAccount()
  const { txHash } = useReceipt()

  const { isLoading, error, sentTokens } = useAddLiquidityReceipt({
    userAddress,
    txHash: txHash as Hash,
  })

  const { validTokens } = useAddLiquidity()
  const { usdValueFor } = useTotalUsdValue(validTokens)
  const totalUSDValue = usdValueFor(sentTokens)

  if (isLoading || isLoadingUserAccount) return <Text>Loading...</Text>
  if (!userAddress) return <Text>User is not connected</Text>
  if (error) return <Text>We were unable to find this TxnHash</Text>

  return <TokensInCard amountsIn={sentTokens} totalUSDValue={totalUSDValue} type="receipt" />
}

export function TokensInCardFromQuote() {
  const { humanAmountsIn, totalUSDValue, tokens } = useAddLiquidity()

  const amountsIn: HumanAmountIn[] = tokens.map(token => {
    if (!token) return missingAmountIn()

    const amountIn = humanAmountsIn.find(amountIn =>
      isSameAddress(amountIn.tokenAddress, token.address as Address)
    ) as HumanAmountIn
    return amountIn
  })

  return <TokensInCard amountsIn={amountsIn} totalUSDValue={totalUSDValue} type="quote" />
}

type Props = {
  amountsIn: HumanAmountIn[]
  totalUSDValue: string
  type: 'quote' | 'receipt'
}
function TokensInCard({ amountsIn, totalUSDValue, type }: Props) {
  const { toCurrency } = useCurrency()
  const { pool } = usePool()

  const isQuote = type === 'quote'

  return (
    <Card variant="modalSubSection">
      <VStack align="start" spacing="md">
        <HStack justify="space-between" w="full">
          <Text color="grayText">{isQuote ? "You're adding" : 'You added'}</Text>
          <Text>{toCurrency(totalUSDValue, { abbreviated: false })}</Text>
        </HStack>
        {amountsIn.map(amountIn => {
          if (!amountIn.tokenAddress) return <div>Missing token</div>

          return (
            <TokenRow
              key={amountIn.tokenAddress}
              value={amountIn.humanAmount}
              address={amountIn.tokenAddress}
              chain={pool.chain}
              abbreviated={false}
            />
          )
        })}
      </VStack>
    </Card>
  )
}
