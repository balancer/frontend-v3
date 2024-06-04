'use client'

import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { HumanAmount } from '@balancer/sdk'
import {
  Card,
  Center,
  HStack,
  VStack,
  Tooltip,
  useDisclosure,
  IconButton,
  Button,
  Box,
  Text,
  CardHeader,
  CardFooter,
  CardBody,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useSwap } from './SwapProvider'
import { TokenSelectModal } from '../tokens/TokenSelectModal/TokenSelectModal'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { Address } from 'viem'
import { SwapPreviewModal } from './modal/SwapModal'
import { TransactionSettings } from '../user/settings/TransactionSettings'
import { PriceImpactAccordion } from '../price-impact/PriceImpactAccordion'
import { PriceImpactProvider } from '@/lib/modules/price-impact/PriceImpactProvider'
import { ChainSelect } from '../chains/ChainSelect'
import { CheckCircle, Link, Repeat } from 'react-feather'
import { SwapRate } from './SwapRate'
import { SwapDetails } from './SwapDetails'
import { capitalize, now } from 'lodash'
import { motion, easeOut } from 'framer-motion'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { ErrorAlert } from '@/lib/shared/components/errors/ErrorAlert'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'
import { useRouter } from 'next/navigation'

export function SwapForm() {
  const router = useRouter()
  const {
    tokenIn,
    tokenOut,
    selectedChain,
    tokens,
    tokenSelectKey,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    simulationQuery,
    swapAction,
    swapTxHash,
    setSelectedChain,
    setTokenInAmount,
    setTokenOutAmount,
    setTokenSelectKey,
    setTokenIn,
    setTokenOut,
    switchTokens,
    setNeedsToAcceptHighPI,
    resetSwapAmounts,
  } = useSwap()
  const [copiedDeepLink, setCopiedDeepLink] = useState(false)
  const tokenSelectDisclosure = useDisclosure()
  const nextBtn = useRef(null)
  const finalRefTokenIn = useRef(null)
  const finalRefTokenOut = useRef(null)
  const isMounted = useIsMounted()

  const tokenMap = { tokenIn, tokenOut }

  function copyDeepLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopiedDeepLink(true)
    setTimeout(() => setCopiedDeepLink(false), 2000)
  }

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

  function onModalClose() {
    previewModalDisclosure.onClose()
    if (swapTxHash) {
      resetSwapAmounts()
      // Push an invalid dynamic route to force a re-render of the swap layout
      router.push(`/swap/${now()}`)
    }
  }

  return (
    <FadeInOnView>
      <PriceImpactProvider>
        <Center
          h="full"
          w={['100vw', 'full']}
          maxW="lg"
          mx="auto"
          position="relative"
          left={['-12px', '0']}
        >
          <Card rounded="xl">
            <CardHeader as={HStack} w="full" justify="space-between" zIndex={11}>
              <span>{capitalize(swapAction)}</span>
              <HStack>
                <Tooltip label={copiedDeepLink ? 'Copied!' : 'Copy deep link'}>
                  <Button variant="tertiary" size="sm" color="grayText" onClick={copyDeepLink}>
                    {copiedDeepLink ? <CheckCircle size={16} /> : <Link size={16} />}
                  </Button>
                </Tooltip>

                <TransactionSettings size="sm" />
              </HStack>
            </CardHeader>
            <CardBody as={VStack} align="start">
              <VStack spacing="md" w="full">
                <ChainSelect
                  value={selectedChain}
                  onChange={newValue => {
                    setSelectedChain(newValue as GqlChain)
                    setTokenInAmount('')
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
                      ml="-4"
                      mt="-4"
                      w="8"
                      h="8"
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
                    disableBalanceValidation
                    isLoadingPriceImpact={
                      simulationQuery.isLoading || !simulationQuery.data || !tokenIn.amount
                    }
                  />
                </VStack>
                {!!simulationQuery.data && (
                  <motion.div
                    style={{ width: '100%', transformOrigin: 'top' }}
                    initial={{ opacity: 0, scaleY: 0.9 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                  >
                    <PriceImpactAccordion
                      setNeedsToAcceptPIRisk={setNeedsToAcceptHighPI}
                      accordionButtonComponent={<SwapRate />}
                      accordionPanelComponent={<SwapDetails />}
                      isDisabled={!simulationQuery.data}
                    />
                  </motion.div>
                )}

                {simulationQuery.isError && (
                  <ErrorAlert title="Error fetching swap">
                    <Text color="font.maxContrast" variant="secondary">
                      {simulationQuery.error?.message || 'Unknown error'}
                    </Text>
                  </ErrorAlert>
                )}
              </VStack>
            </CardBody>
            <CardFooter>
              <Tooltip label={isDisabled ? disabledReason : ''}>
                <Button
                  ref={nextBtn}
                  variant="secondary"
                  w="full"
                  size="lg"
                  isDisabled={isDisabled || !isMounted}
                  isLoading={simulationQuery.isLoading || !isMounted}
                  onClick={() => !isDisabled && previewModalDisclosure.onOpen()}
                >
                  Next
                </Button>
              </Tooltip>
            </CardFooter>
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
          onClose={onModalClose}
        />
      </PriceImpactProvider>
    </FadeInOnView>
  )
}
