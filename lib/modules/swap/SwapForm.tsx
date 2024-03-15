'use client'

import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { HumanAmount } from '@balancer/sdk'
import {
  Card,
  Center,
  HStack,
  Heading,
  VStack,
  Tooltip,
  useDisclosure,
  IconButton,
  Button,
  Box,
} from '@chakra-ui/react'
import { useMemo, useRef } from 'react'
import { useSwap } from './useSwap'
import { useTokens } from '../tokens/useTokens'
import { TokenSelectModal } from '../tokens/TokenSelectModal/TokenSelectModal'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { Address } from 'viem'
import { SwapPreviewModal } from './SwapPreviewModal'
import { TransactionSettings } from '../user/settings/TransactionSettings'
import { PriceImpactAccordion } from '../../shared/components/accordion/PriceImpactAccordion'
import { TokenInputsValidationProvider } from '../tokens/useTokenInputsValidation'
import { PriceImpactProvider } from '@/lib/shared/hooks/usePriceImpact'
import { ChainSelect } from '../chains/ChainSelect'
import { Globe, Repeat } from 'react-feather'
import { SwapRate } from './SwapRate'
import { SwapDetails } from './SwapDetails'
import { capitalize } from 'lodash'

export function SwapForm() {
  const {
    tokenIn,
    tokenOut,
    selectedChain,
    tokenSelectKey,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    simulationQuery,
    swapAction,
    setSelectedChain,
    setTokenInAmount,
    setTokenOutAmount,
    setTokenSelectKey,
    setTokenIn,
    setTokenOut,
    switchTokens,
    setNeedsToAcceptHighPI,
  } = useSwap()
  const { getTokensByChain } = useTokens()
  const tokenSelectDisclosure = useDisclosure()
  const nextBtn = useRef(null)
  const finalRefTokenIn = useRef(null)
  const finalRefTokenOut = useRef(null)

  const tokenMap = { tokenIn, tokenOut }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tokens = useMemo(() => getTokensByChain(selectedChain), [selectedChain])

  // Exclude the currently selected token from the token select modal search.
  const tokenSelectTokens = tokens.filter(
    token =>
      !isSameAddress(
        token.address,
        tokenMap[tokenSelectKey === 'tokenIn' ? 'tokenOut' : 'tokenIn'].address
      )
  )

  function handleTokenSelect(token: GqlToken) {
    if (tokenSelectKey === 'tokenIn') {
      setTokenIn(token.address as Address)
    } else if (tokenSelectKey === 'tokenOut') {
      setTokenOut(token.address as Address)
    } else {
      console.error('Unhandled token select key', tokenSelectKey)
    }
  }

  function openTokenSelectModal(tokenSelectKey: 'tokenIn' | 'tokenOut') {
    setTokenSelectKey(tokenSelectKey)
    tokenSelectDisclosure.onOpen()
  }

  return (
    <TokenBalancesProvider tokens={tokens}>
      <TokenInputsValidationProvider>
        <PriceImpactProvider>
          <Center h="full" w="full" maxW="lg" mx="auto">
            <Card variant="level3" shadow="xl" w="full" p="md">
              <VStack spacing="lg" align="start">
                <HStack w="full" justify="space-between">
                  <Heading fontWeight="bold" size="h5">
                    {capitalize(swapAction)}
                  </Heading>
                  <TransactionSettings size="sm" />
                </HStack>
                <VStack spacing="md" w="full">
                  <ChainSelect
                    value={selectedChain}
                    onChange={newValue => {
                      setSelectedChain(newValue as GqlChain)
                    }}
                  />
                  <VStack w="full">
                    <TokenInput
                      ref={finalRefTokenIn}
                      address={tokenIn.address}
                      chain={selectedChain}
                      value={tokenIn.amount}
                      onChange={e => setTokenInAmount(e.currentTarget.value as HumanAmount)}
                      toggleTokenSelect={() => openTokenSelectModal('tokenIn')}
                    />
                    <Box position="relative" border="red 1px solid">
                      <IconButton
                        position="absolute"
                        variant="tertiary"
                        size="sm"
                        fontSize="2xl"
                        ml="-16px"
                        mt="-16px"
                        isRound={true}
                        aria-label="Switch tokens"
                        icon={<Repeat size={16} />}
                        onClick={switchTokens}
                      />
                    </Box>
                    <TokenInput
                      ref={finalRefTokenOut}
                      address={tokenOut.address}
                      chain={selectedChain}
                      value={tokenOut.amount}
                      onChange={e => setTokenOutAmount(e.currentTarget.value as HumanAmount)}
                      toggleTokenSelect={() => openTokenSelectModal('tokenOut')}
                      hasPriceImpact
                      isLoadingPriceImpact={
                        simulationQuery.isLoading || !simulationQuery.data || !tokenIn.amount
                      }
                    />
                  </VStack>

                  {simulationQuery.data && (
                    <PriceImpactAccordion
                      setNeedsToAcceptHighPI={setNeedsToAcceptHighPI}
                      accordionButtonComponent={<SwapRate />}
                      accordionPanelComponent={<SwapDetails />}
                    />
                  )}

                  <Tooltip label={isDisabled ? disabledReason : ''}>
                    <Button
                      ref={nextBtn}
                      variant="secondary"
                      w="full"
                      size="lg"
                      isDisabled={isDisabled}
                      onClick={() => !isDisabled && previewModalDisclosure.onOpen()}
                    >
                      Next
                    </Button>
                  </Tooltip>
                </VStack>
              </VStack>
            </Card>
          </Center>
          <TokenSelectModal
            finalFocusRef={tokenSelectKey === 'tokenIn' ? finalRefTokenIn : finalRefTokenOut}
            chain={selectedChain}
            tokens={tokenSelectTokens}
            isOpen={tokenSelectDisclosure.isOpen}
            onOpen={tokenSelectDisclosure.onOpen}
            onClose={tokenSelectDisclosure.onClose}
            onTokenSelect={handleTokenSelect}
          />
          <SwapPreviewModal
            finalFocusRef={nextBtn}
            isOpen={previewModalDisclosure.isOpen}
            onOpen={previewModalDisclosure.onOpen}
            onClose={previewModalDisclosure.onClose}
          />
        </PriceImpactProvider>
      </TokenInputsValidationProvider>
    </TokenBalancesProvider>
  )
}
