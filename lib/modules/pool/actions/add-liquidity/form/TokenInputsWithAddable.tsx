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
    } else {
      setIsMaximized(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalUSDValue, wantsProportional])

  function handleWantProportional() {
    setWantsProportional(!wantsProportional)
    clearAmountsIn()
  }

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
              <WalletIcon size={18} />
            </Box>
            <HStack spacing="xs">
              {!requiresProportionalInput && canMaximizeForProportionalInput ? (
                <>
                  <Text
                    fontSize="sm"
                    color="font.highlight"
                    onClick={handleWantProportional}
                    cursor="pointer"
                  >
                    {`${wantsProportional ? 'Proportional' : 'Total'}`}
                  </Text>
                  <Text fontSize="sm" color="grayText">
                    addable pool tokens
                  </Text>
                </>
              ) : (
                <Text fontSize="sm" color="grayText">
                  Addable pool tokens
                </Text>
              )}
            </HStack>
            <Spacer />
            {canMaximize && (
              <>
                <Text fontSize="sm" color="grayText">
                  {toCurrency(maximizedUsdValue, { abbreviated: false })}
                </Text>
                {isMaximized && (
                  <Text fontSize="sm" color="grayText" cursor="not-allowed" opacity="0.5">
                    Maxed
                  </Text>
                )}
                {!isMaximized && (
                  <Text
                    fontSize="sm"
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
                <Text fontSize="sm" color="red.400">
                  {toCurrency('0', { abbreviated: false })}
                </Text>
                <Box color="red.400">
                  <XOctagon size={14} />
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
