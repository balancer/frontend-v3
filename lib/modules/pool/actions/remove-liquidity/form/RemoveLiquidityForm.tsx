/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { InputWithSlider } from '@/lib/shared/components/inputs/InputWithSlider/InputWithSlider'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { fNum } from '@/lib/shared/utils/numbers'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Button,
  Card,
  Center,
  HStack,
  Heading,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { RemoveLiquidityModal } from '../modal/RemoveLiquidityModal'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { RemoveLiquidityProportional } from './RemoveLiquidityProportional'
import { RemoveLiquiditySingleToken } from './RemoveLiquiditySingleToken'
import { usePool } from '../../../usePool'
import { usePoolRedirect } from '../../../pool.hooks'
import { TransactionSettings } from '@/lib/modules/user/settings/TransactionSettings'

const TABS: ButtonGroupOption[] = [
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
  const {
    tokens,
    validTokens,
    humanBptInPercent,
    totalUsdValue,
    priceImpactQuery,
    previewModalDisclosure,
    isDisabled,
    disabledReason,
    simulationQuery,
    isTxConfirmingOrConfirmed,
    setProportionalType,
    setSingleTokenType,
    setHumanBptInPercent,
  } = useRemoveLiquidity()
  const { pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)
  const { toCurrency } = useCurrency()
  const nextBtn = useRef(null)
  const [activeTab, setActiveTab] = useState(TABS[0])

  const priceImpact = priceImpactQuery?.data
  const priceImpactLabel = priceImpact !== undefined ? fNum('priceImpact', priceImpact) : '-' // If it's 0 we want to display 0.

  function toggleTab(option: ButtonGroupOption) {
    setActiveTab(option)
    if (option.value === 'proportional') {
      setProportionalType()
    }
    if (option.value === 'single') {
      setSingleTokenType()
    }
  }

  const onModalClose = () => {
    if (isTxConfirmingOrConfirmed) {
      // If the transaction is confirming or confirmed, it's very likely that
      // they no longer have a pool balance. To be safe, always redirect to the
      // pool page when closing the modal in this state.
      redirectToPoolPage()
    } else {
      previewModalDisclosure.onClose()
    }
  }

  return (
    <TokenBalancesProvider tokens={validTokens}>
      <Center h="full" w="full" maxW="lg" mx="auto">
        <Card variant="level3" shadow="xl" w="full" p="md">
          <VStack spacing="lg" align="start">
            <HStack justify="space-between" w="full">
              <Heading fontWeight="bold" size="h5">
                Remove liquidity
              </Heading>
              <TransactionSettings size="sm" />
            </HStack>
            <HStack>
              <ButtonGroup
                currentOption={activeTab}
                options={TABS}
                onChange={toggleTab}
                size="lg"
              />
              <Tooltip label="Remove liquidity type" fontSize="sm">
                <InfoOutlineIcon color="grayText" />
              </Tooltip>
            </HStack>
            <VStack w="full" spacing="md">
              <InputWithSlider
                value={totalUsdValue}
                onPercentChanged={setHumanBptInPercent}
                isNumberInputDisabled
              >
                <Text fontSize="sm">Amount</Text>
                <Text fontSize="sm" variant="secondary">
                  {fNum('percentage', humanBptInPercent / 100)}
                </Text>
              </InputWithSlider>
              {activeTab === TABS[0] && <RemoveLiquidityProportional tokens={tokens} />}
              {activeTab === TABS[1] && <RemoveLiquiditySingleToken tokens={tokens} />}
            </VStack>
            <VStack spacing="sm" align="start" w="full" px="md">
              <HStack justify="space-between" w="full">
                <Text color="grayText">Total</Text>
                <HStack>
                  <NumberText color="grayText">{toCurrency(totalUsdValue)}</NumberText>
                  <Tooltip label="Total" fontSize="sm">
                    <InfoOutlineIcon color="grayText" />
                  </Tooltip>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text color="grayText">Price impact</Text>
                <HStack>
                  {priceImpactQuery.isLoading ? (
                    <Skeleton w="12" h="full" />
                  ) : (
                    <NumberText color="grayText">{priceImpactLabel}</NumberText>
                  )}
                  <Tooltip label="Price impact" fontSize="sm">
                    <InfoOutlineIcon color="grayText" />
                  </Tooltip>
                </HStack>
              </HStack>
            </VStack>
            <Tooltip label={isDisabled ? disabledReason : ''}>
              <Button
                ref={nextBtn}
                variant="secondary"
                w="full"
                size="lg"
                isDisabled={isDisabled || simulationQuery.isLoading}
                onClick={() => !isDisabled && previewModalDisclosure.onOpen()}
              >
                Next
              </Button>
            </Tooltip>
          </VStack>
        </Card>
        <RemoveLiquidityModal
          finalFocusRef={nextBtn}
          isOpen={previewModalDisclosure.isOpen}
          onOpen={previewModalDisclosure.onOpen}
          onClose={onModalClose}
        />
      </Center>
    </TokenBalancesProvider>
  )
}
