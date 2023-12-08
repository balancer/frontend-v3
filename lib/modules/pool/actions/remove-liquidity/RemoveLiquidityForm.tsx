'use client'

import { useDisclosure } from '@chakra-ui/hooks'
import { useRemoveLiquidity } from './useRemoveLiquidity'
import { useRef } from 'react'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import {
  Button,
  Card,
  Center,
  HStack,
  Heading,
  VStack,
  Text,
  Tooltip,
  Icon,
} from '@chakra-ui/react'
import { RemoveLiquidityModal } from './RemoveLiquidityModal'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { priceImpactFormat } from '@/lib/shared/utils/numbers'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { FiSettings } from 'react-icons/fi'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { InputWithSlider } from '@/lib/shared/components/inputs/InputWithSlider/InputWithSlider'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Address } from 'viem'

const TABS = [
  {
    value: 'proportional',
    label: 'Proportional',
  },
  {
    value: 'single',
    label: 'Single token',
  },
]

export function RemoveLiquidityForm() {
  const { amountsOut, totalUSDValue, setAmountOut, tokens, validTokens } = useRemoveLiquidity()
  const { toCurrency } = useCurrency()
  const previewDisclosure = useDisclosure()
  const nextBtn = useRef(null)
  const activeTab = TABS[0]

  function currentValueFor(tokenAddress: string) {
    const amountOut = amountsOut.find(amountOut =>
      isSameAddress(amountOut.tokenAddress, tokenAddress)
    )
    return amountOut ? amountOut.value : ''
  }

  function submit() {
    console.log(amountsOut)
    previewDisclosure.onOpen()
  }

  function toggleFlow(option: ButtonGroupOption) {
    console.log({ option })
    return option
  }

  return (
    <TokenBalancesProvider tokens={validTokens}>
      <Center h="full" w="full" maxW="lg" mx="auto">
        <Card variant="level3" shadow="xl" w="full" p="md">
          <VStack spacing="lg" align="start">
            <HStack justifyContent="space-between" w="full">
              <Heading fontWeight="bold" size="h5">
                Remove liquidity
              </Heading>
              <Icon as={FiSettings} aria-label="settings" />
            </HStack>
            <HStack>
              <ButtonGroup
                currentOption={activeTab}
                options={TABS}
                onChange={toggleFlow}
                size="lg"
              />
              <Tooltip label="Remove liquidity type" fontSize="sm">
                <InfoOutlineIcon color="GrayText" />
              </Tooltip>
            </HStack>
            <VStack w="full">
              <InputWithSlider />
              <Card variant="level8" p="md" shadow="lg" w="full">
                <VStack>
                  <HStack w="full" justifyContent="space-between">
                    <Text fontWeight="bold" fontSize="1rem">
                      You&apos;ll get at least
                    </Text>
                    <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                      With max slippage: 0.50%
                    </Text>
                  </HStack>
                  {tokens.map(
                    token =>
                      token && (
                        <TokenRow
                          chain={token.chain}
                          key={`my-liquidity-token-${token.address}`}
                          address={token.address as Address}
                          value={0}
                        />
                      )
                  )}
                </VStack>
              </Card>
            </VStack>
            <VStack spacing="sm" align="start" w="full">
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Total</Text>
                <HStack>
                  <NumberText color="GrayText">{toCurrency(totalUSDValue)}</NumberText>
                  <Tooltip label="Total" fontSize="sm">
                    <InfoOutlineIcon color="GrayText" />
                  </Tooltip>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Price impact</Text>
                <HStack>
                  <NumberText color="GrayText">{priceImpactFormat(0)}</NumberText>
                  <Tooltip label="Price impact" fontSize="sm">
                    <InfoOutlineIcon color="GrayText" />
                  </Tooltip>
                </HStack>
              </HStack>
            </VStack>
            <Button ref={nextBtn} variant="secondary" w="full" size="lg" onClick={submit}>
              Next
            </Button>
          </VStack>
        </Card>
        <RemoveLiquidityModal
          finalFocusRef={nextBtn}
          isOpen={previewDisclosure.isOpen}
          onOpen={previewDisclosure.onOpen}
          onClose={previewDisclosure.onClose}
        />
      </Center>
    </TokenBalancesProvider>
  )
}
