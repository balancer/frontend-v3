import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { WalletIcon } from '@/lib/shared/components/icons/WalletIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { Alert, AlertIcon, Card, HStack, Spacer, VStack, Text, Box } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { XOctagon } from 'react-feather'
import { useAddLiquidity } from '../AddLiquidityProvider'
import { TokenInputs } from './TokenInputs'
import { useProportionalInputs } from './useProportionalInputs'
import { useMaximumInputs } from './useMaximumInputs'

type Props = {
  tokenSelectDisclosureOpen: () => void
  requiresProportionalInput: boolean
  totalUSDValue: string
}

export function TokenInputsWithAddable({
  tokenSelectDisclosureOpen,
  requiresProportionalInput,
  totalUSDValue,
}: Props) {
  const { isConnected } = useUserAccount()
  const { toCurrency } = useCurrency()
  const { setHumanAmountIn } = useAddLiquidity()
  const [wantsProportional, setWantsProportional] = useState(false)

  const {
    handleProportionalHumanInputChange,
    handleMaximizeUserAmounts: handleMaximizeUserAmountsForProportionalInput,
    isMaximized: isMaximizedForProportionalInput,
    maximizedUsdValue: maximizedUsdValueForProportionalInput,
    canMaximize: canMaximizeForProportionalInput,
    setIsMaximized: setIsMaximizedForProportionalInput,
    clearAmountsIn,
  } = useProportionalInputs()

  const {
    canMaximize: canMaximizeForMaximumInput,
    isMaximized: isMaximizedForMaximumInput,
    maximizedUsdValue: maximizedUsdValueForMaximumInput,
    handleMaximizeUserAmounts: handleMaximizeUserAmountsForMaximumInput,
    setIsMaximized: setIsMaximizedForMaximumInput,
  } = useMaximumInputs()

  const isProportional = requiresProportionalInput || wantsProportional

  const handleMaximizeUserAmounts = isProportional
    ? handleMaximizeUserAmountsForProportionalInput
    : handleMaximizeUserAmountsForMaximumInput

  const isMaximized = isProportional ? isMaximizedForProportionalInput : isMaximizedForMaximumInput

  const maximizedUsdValue = isProportional
    ? maximizedUsdValueForProportionalInput
    : maximizedUsdValueForMaximumInput

  const canMaximize = isProportional ? canMaximizeForProportionalInput : canMaximizeForMaximumInput

  const setIsMaximized = isProportional
    ? setIsMaximizedForProportionalInput
    : setIsMaximizedForMaximumInput

  const setAmountIn = isProportional ? handleProportionalHumanInputChange : setHumanAmountIn

  useEffect(() => {
    if (totalUSDValue !== maximizedUsdValue) {
      setIsMaximized(false)
      clearAmountsIn()
    } else {
      setIsMaximized(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalUSDValue, wantsProportional])

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
            {canMaximizeForProportionalInput && (
              <Text
                fontSize="md"
                color="font.highlight"
                onClick={() => setWantsProportional(!wantsProportional)}
                cursor="pointer"
              >
                {`${wantsProportional ? 'Proportional' : 'Custom'}`}
              </Text>
            )}
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
      <TokenInputs
        tokenSelectDisclosureOpen={tokenSelectDisclosureOpen}
        customSetAmountIn={setAmountIn}
      ></TokenInputs>
    </VStack>
  )
}
