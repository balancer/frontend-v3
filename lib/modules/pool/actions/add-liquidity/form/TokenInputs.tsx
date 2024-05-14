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
import { XOctagon } from 'react-feather'

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
    if (totalUSDValue !== maximizedUsdValue) {
      setIsMaximized(false)
    } else {
      setIsMaximized(true)
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
      {isConnected && (
        <Card variant="subSection" w="full" p={['sm', 'ms']}>
          <HStack w="full">
            <Box as="span" color="grayText">
              <WalletIcon size={20} />
            </Box>
            <Text fontSize="md" color="grayText">
              Addable pool tokens
            </Text>
            <Spacer />
            {canMaximize && (
              <>
                <Text fontSize="md" color="grayText">
                  {toCurrency(maximizedUsdValue, { abbreviated: false })}
                </Text>
                {isMaximized && (
                  <Text fontSize="md" color="grayText" cursor="default">
                    Maxed
                  </Text>
                )}
                {!isMaximized && (
                  <Text
                    fontSize="md"
                    color="font.highlight"
                    onClick={() => handleMaximizeUserAmounts()}
                    cursor="pointer"
                  >
                    Max
                  </Text>
                )}
              </>
            )}
            {!canMaximize && (
              <HStack>
                <Text fontSize="md" color="red.400">
                  {toCurrency('0', { abbreviated: false })}
                </Text>
                <Box color="red.400">
                  <XOctagon size={16} />
                </Box>
              </HStack>
            )}
          </HStack>
        </Card>
      )}
      {tokens.map((token, i) => {
        if (!token) return <div key={i}>Missing token</div>

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
