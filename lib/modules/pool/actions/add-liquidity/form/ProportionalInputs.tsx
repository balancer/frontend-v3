import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { HumanAmount } from '@balancer/sdk'
import { Alert, AlertIcon, HStack, Skeleton, Switch, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'
import { useAddLiquidity } from '../useAddLiquidity'
import { useProportionalInputs } from './useProportionalInputs'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

/*
   Edge-case UI to show custom inputs when adding proportional liquidity
*/
export function ProportionalInputs() {
  const { isConnected } = useUserAccount()
  const { toCurrency } = useCurrency()
  const { tokens, humanAmountsIn: amountsIn } = useAddLiquidity()
  const {
    handleHumanInputChange,
    handleMaximizeUserAmounts,
    isMaximized,
    maximizedUsdValue,
    isLoading,
  } = useProportionalInputs()

  function currentValueFor(tokenAddress: string) {
    const amountIn = amountsIn.find(amountIn => isSameAddress(amountIn.tokenAddress, tokenAddress))
    return amountIn ? amountIn.humanAmount : ''
  }

  return (
    <VStack spacing="md" w="full">
      <Alert status="info">
        <AlertIcon />
        This pool requires liquidity to be added proportionally
      </Alert>
      {isConnected ? (
        isLoading ? (
          <Skeleton h="5" w="full" />
        ) : (
          <HStack spacing="md" w="full">
            <Switch isChecked={isMaximized} onChange={handleMaximizeUserAmounts} />
            <Text>
              Add your max amount: {toCurrency(maximizedUsdValue, { abbreviated: false })}
            </Text>
          </HStack>
        )
      ) : null}

      {tokens.map(token => {
        if (!token) return <div>Missing token</div>
        return (
          <TokenInput
            key={token.address}
            address={token.address}
            chain={token.chain}
            value={currentValueFor(token.address)}
            onChange={e =>
              handleHumanInputChange(token.address as Address, e.currentTarget.value as HumanAmount)
            }
          />
        )
      })}
    </VStack>
  )
}
