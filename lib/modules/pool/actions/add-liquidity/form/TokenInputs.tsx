import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { HumanAmount } from '@balancer/sdk'
import { Alert, AlertIcon, Box, Card, HStack, Spacer, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'
import { useAddLiquidity } from '../useAddLiquidity'
import { useProportionalInputs } from './useProportionalInputs'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { isNativeOrWrappedNative } from '@/lib/modules/tokens/token.helpers'
import { WalletIcon } from '@/lib/shared/components/icons/WalletIcon'
import { useEffect } from 'react'

type Props = {
  tokenSelectDisclosureOpen: () => void
  requiresProportionalInput: boolean
  totalUSDValue: string
}

export function TokenInputs({
  tokenSelectDisclosureOpen,
  requiresProportionalInput,
  totalUSDValue,
}: Props) {
  const { isConnected } = useUserAccount()
  const { toCurrency } = useCurrency()
  const { tokens, humanAmountsIn, setHumanAmountIn } = useAddLiquidity()
  const {
    handleProportionalHumanInputChange,
    handleMaximizeUserAmounts,
    isMaximized,
    maximizedUsdValue,
    canMaximize,
    setIsMaximized,
    refetchBalances,
  } = useProportionalInputs()

  function currentValueFor(tokenAddress: string) {
    const amountIn = humanAmountsIn.find(amountIn =>
      isSameAddress(amountIn.tokenAddress, tokenAddress)
    )
    return amountIn ? amountIn.humanAmount : ''
  }

  const setAmountIn = requiresProportionalInput
    ? handleProportionalHumanInputChange
    : setHumanAmountIn

  useEffect(() => {
    refetchBalances()
    if (totalUSDValue !== maximizedUsdValue) {
      setIsMaximized(false)
    }
  }, [totalUSDValue])

  return (
    <VStack spacing="md" w="full">
      {requiresProportionalInput && (
        <Alert status="info">
          <AlertIcon />
          This pool requires liquidity to be added proportionally
        </Alert>
      )}
      {isConnected && canMaximize && (
        <Card variant="subSection" w="full" p={['sm', 'ms']}>
          <HStack w="full">
            <Box as="span" color="grayText">
              <WalletIcon size={20} />
            </Box>
            <Text fontSize="md" color="grayText">
              Addable pool tokens
            </Text>
            <Spacer />
            <Text fontSize="md" color="grayText">
              {toCurrency(maximizedUsdValue, { abbreviated: false })}
            </Text>
            <Text
              fontSize="md"
              color={isMaximized ? 'grayText' : 'font.highlight'}
              onClick={() => !isMaximized && handleMaximizeUserAmounts()}
              cursor={isMaximized ? 'default' : 'pointer'}
            >
              Max
            </Text>
          </HStack>
        </Card>
      )}
      {tokens.map(token => {
        if (!token) return <div>Missing token</div>
        return (
          <TokenInput
            key={token.address}
            address={token.address}
            chain={token.chain}
            value={currentValueFor(token.address)}
            onChange={e =>
              setAmountIn(token.address as Address, e.currentTarget.value as HumanAmount)
            }
            toggleTokenSelect={
              isNativeOrWrappedNative(token.address as Address, token.chain)
                ? tokenSelectDisclosureOpen
                : undefined
            }
          />
        )
      })}
    </VStack>
  )
}
