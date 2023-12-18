'use client'

import { useDisclosure } from '@chakra-ui/hooks'
import { useRemoveLiquidity } from './useRemoveLiquidity'
import { useEffect, useRef, useState } from 'react'
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
  Box,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import { RemoveLiquidityModal } from './RemoveLiquidityModal'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { integerPercentageFormat, priceImpactFormat } from '@/lib/shared/utils/numbers'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { FiSettings } from 'react-icons/fi'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { InputWithSlider } from '@/lib/shared/components/inputs/InputWithSlider/InputWithSlider'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Address } from 'viem'
import { GqlToken, GqlTokenAmountHumanReadable } from '@/lib/shared/services/api/generated/graphql'
import React from 'react'

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

function RemoveLiquidityProportional({ tokens }: { tokens: (GqlToken | undefined)[] }) {
  return (
    <Card variant="level8" p="md" shadow="lg" w="full">
      <VStack>
        <HStack w="full" justify="space-between">
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
                key={token.address}
                address={token.address as Address}
                value={0}
              />
            )
        )}
      </VStack>
    </Card>
  )
}

interface RemoveLiquiditySingleTokenProps {
  tokens: (GqlToken | undefined)[]
  setSingleToken: (value: string) => void
  singleToken: GqlTokenAmountHumanReadable | null
}

function RemoveLiquiditySingleToken({
  tokens,
  singleToken,
  setSingleToken,
}: RemoveLiquiditySingleTokenProps) {
  return (
    <VStack w="full">
      <HStack w="full" justify="space-between">
        <Text fontWeight="bold" fontSize="1rem">
          Choose a token to receive
        </Text>
      </HStack>
      <Box
        borderRadius="md"
        p="md"
        shadow="innerBase"
        bg="background.card.level1"
        border="white"
        w="full"
      >
        <RadioGroup onChange={setSingleToken} value={singleToken?.address}>
          <VStack w="full">
            {tokens.map(
              token =>
                token && (
                  <HStack key={token.address} w="full">
                    <Radio value={token.address} />
                    <TokenRow chain={token.chain} address={token.address as Address} value={0} />
                  </HStack>
                )
            )}
          </VStack>
        </RadioGroup>
      </Box>
    </VStack>
  )
}

export function RemoveLiquidityForm() {
  const {
    tokens,
    validTokens,
    proportionalPercent,
    setProportionalPercent,
    singleToken,
    setSingleToken,
    setProportional,
  } = useRemoveLiquidity()
  const { toCurrency } = useCurrency()
  const previewDisclosure = useDisclosure()
  const nextBtn = useRef(null)
  const [activeTab, setActiveTab] = useState(TABS[0])

  function submit() {
    previewDisclosure.onOpen()
  }

  function toggleTab(option: ButtonGroupOption) {
    setActiveTab(option)
  }

  useEffect(() => {
    // actively choosing a single token will set the correct selectedRemoveLiquidityType
    if (activeTab === TABS[0]) {
      setProportional()
    }
  }, [activeTab])

  return (
    <TokenBalancesProvider tokens={validTokens}>
      <Center h="full" w="full" maxW="lg" mx="auto">
        <Card variant="level3" shadow="xl" w="full" p="md">
          <VStack spacing="lg" align="start">
            <HStack justify="space-between" w="full">
              <Heading fontWeight="bold" size="h5">
                Remove liquidity
              </Heading>
              <Icon as={FiSettings} aria-label="settings" />
            </HStack>
            <HStack>
              <ButtonGroup
                currentOption={activeTab}
                options={TABS}
                onChange={toggleTab}
                size="lg"
              />
              <Tooltip label="Remove liquidity type" fontSize="sm">
                <InfoOutlineIcon color="GrayText" />
              </Tooltip>
            </HStack>
            <VStack w="full" gap="md">
              <InputWithSlider
                value={proportionalPercent.toString()}
                setValue={setProportionalPercent}
              >
                <Text>Amount</Text>
                <Text>{integerPercentageFormat(proportionalPercent / 100)}</Text>
              </InputWithSlider>
              {activeTab === TABS[0] && <RemoveLiquidityProportional tokens={tokens} />}
              {activeTab === TABS[1] && (
                <RemoveLiquiditySingleToken
                  tokens={tokens}
                  singleToken={singleToken}
                  setSingleToken={setSingleToken}
                />
              )}
            </VStack>
            <VStack spacing="sm" align="start" w="full">
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Total</Text>
                <HStack>
                  <NumberText color="GrayText">{toCurrency(0)}</NumberText>
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
