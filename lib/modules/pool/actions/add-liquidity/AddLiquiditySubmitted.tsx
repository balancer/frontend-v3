'use client'

import { Button, Center, IconButton, Spinner, Text, VStack } from '@chakra-ui/react'
import { useAddLiquidity } from './useAddLiquidity'
import { HumanAmountIn } from '../liquidity-types'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { Address } from 'viem'
import { isZero } from '@/lib/shared/utils/numbers'
import { useTransactionFlow } from '@/lib/modules/transactions/transaction-steps/TransactionFlowProvider'
import { useRouter } from 'next/navigation'

export function AddLiquiditySubmitted() {
  const { humanAmountsIn, totalUSDValue, tokens } = useAddLiquidity()
  const { txHash } = useTransactionFlow()
  const { toCurrency } = useCurrency()
  const router = useRouter()

  const amountsIn = tokens
    .map(token => {
      if (!token) return undefined

      const amountIn = humanAmountsIn.find(amountIn =>
        isSameAddress(amountIn.tokenAddress, token.address as Address)
      ) as HumanAmountIn

      if (isZero(amountIn.humanAmount) || amountIn.humanAmount === '') return undefined

      return { amount: amountIn.humanAmount as string, symbol: token.symbol }
    })
    .filter(Boolean) as { amount: string; symbol: string }[]

  function redirectToReceipt() {
    router.push(`./add-liquidity/${txHash}`)
  }

  return (
    <Center>
      <VStack spacing="md">
        <IconButton
          isRound
          aria-label="pending"
          w="16"
          h="16"
          color="orange.300"
          icon={<Spinner thickness="2px" emptyColor="border.base" color="orange.300" size="lg" />}
        />
        <VStack spacing="xs">
          <Text color="grayText">Transaction pending</Text>
          <Text color="white" fontSize="lg">
            Adding {toCurrency(totalUSDValue, { abbreviated: false })}
          </Text>
          <Text color="grayText" fontSize="sm">
            (
            {amountsIn.map(({ amount, symbol }, index) => (
              <span key={symbol}>
                {index > 0 && ' + '}
                {amount} {symbol}
              </span>
            ))}
            )
          </Text>
        </VStack>

        <Button onClick={redirectToReceipt}>View receipt</Button>
      </VStack>
    </Center>
  )
}
