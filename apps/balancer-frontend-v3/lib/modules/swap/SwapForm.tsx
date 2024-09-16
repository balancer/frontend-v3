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
  CardHeader,
  CardFooter,
  CardBody,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useSwap } from './SwapProvider'
import { TokenSelectModal } from '../tokens/TokenSelectModal/TokenSelectModal'
import { Address } from 'viem'
import { SwapPreviewModal } from './modal/SwapModal'
import { TransactionSettings } from '../user/settings/TransactionSettings'
import { PriceImpactAccordion } from '../price-impact/PriceImpactAccordion'
import { ChainSelect } from '../chains/ChainSelect'
import { CheckCircle, Link, Repeat } from 'react-feather'
import { SwapRate } from './SwapRate'
import { SwapDetails } from './SwapDetails'
import { capitalize } from 'lodash'
import { motion, easeOut } from 'framer-motion'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { ErrorAlert } from '@/lib/shared/components/errors/ErrorAlert'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'
import { parseSwapError } from './swap.helpers'
import { useUserAccount } from '../web3/UserAccountProvider'
import { ConnectWallet } from '../web3/ConnectWallet'
import { SafeAppAlert } from '@/lib/shared/components/alerts/SafeAppAlert'

export function SwapForm() {
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
    transactionSteps,
    setSelectedChain,
    setTokenInAmount,
    setTokenOutAmount,
    setTokenSelectKey,
    setTokenIn,
    setTokenOut,
    switchTokens,
    setNeedsToAcceptHighPI,
    resetSwapAmounts,
    replaceUrlPath,
  } = useSwap()
  const [copiedDeepLink, setCopiedDeepLink] = useState(false)
  const tokenSelectDisclosure = useDisclosure()
  const nextBtn = useRef(null)
  const finalRefTokenIn = useRef(null)
  const finalRefTokenOut = useRef(null)
  const isMounted = useIsMounted()
  const { isConnected } = useUserAccount()

  const isLoadingSwaps = simulationQuery.isLoading
  const isLoading = isLoadingSwaps || !isMounted
  const loadingText = isLoading ? 'Fetching swap...' : undefined

  function copyDeepLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopiedDeepLink(true)
    setTimeout(() => setCopiedDeepLink(false), 2000)
  }

  function handleTokenSelect(token: GqlToken) {
    if (!token) return
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
      replaceUrlPath()
      transactionSteps.resetTransactionSteps()
    }
  }

  return (
    <FadeInOnView>
      <Center
        h="full"
        left={['-12px', '0']}
        maxW="lg"
        mx="auto"
        position="relative"
        w={['100vw', 'full']}
      >
        <Card rounded="xl">
          <CardHeader as={HStack} justify="space-between" w="full" zIndex={11}>
            <span>{capitalize(swapAction)}</span>
            <HStack>
              <Tooltip label={copiedDeepLink ? 'Copied!' : 'Copy swap link'}>
                <Button color="grayText" onClick={copyDeepLink} size="sm" variant="tertiary">
                  {copiedDeepLink ? <CheckCircle size={16} /> : <Link size={16} />}
                </Button>
              </Tooltip>

              <TransactionSettings size="sm" />
            </HStack>
          </CardHeader>
          <CardBody align="start" as={VStack}>
            <VStack spacing="md" w="full">
              <SafeAppAlert />
              <ChainSelect
                onChange={newValue => {
                  setSelectedChain(newValue as GqlChain)
                  setTokenInAmount('')
                }}
                value={selectedChain}
              />
              <VStack w="full">
                <TokenInput
                  address={tokenIn.address}
                  chain={selectedChain}
                  onChange={e => setTokenInAmount(e.currentTarget.value as HumanAmount)}
                  ref={finalRefTokenIn}
                  toggleTokenSelect={() => openTokenSelectModal('tokenIn')}
                  value={tokenIn.amount}
                />
                <Box border="red 1px solid" position="relative">
                  <IconButton
                    aria-label="Switch tokens"
                    fontSize="2xl"
                    h="8"
                    icon={<Repeat size={16} />}
                    isRound
                    ml="-4"
                    mt="-4"
                    onClick={switchTokens}
                    position="absolute"
                    size="sm"
                    variant="tertiary"
                    w="8"
                  />
                </Box>
                <TokenInput
                  address={tokenOut.address}
                  chain={selectedChain}
                  disableBalanceValidation
                  hasPriceImpact
                  isLoadingPriceImpact={
                    simulationQuery.isLoading || !simulationQuery.data || !tokenIn.amount
                  }
                  onChange={e => setTokenOutAmount(e.currentTarget.value as HumanAmount)}
                  ref={finalRefTokenOut}
                  toggleTokenSelect={() => openTokenSelectModal('tokenOut')}
                  value={tokenOut.amount}
                />
              </VStack>
              {!!simulationQuery.data && (
                <motion.div
                  animate={{ opacity: 1, scaleY: 1 }}
                  initial={{ opacity: 0, scaleY: 0.9 }}
                  style={{ width: '100%', transformOrigin: 'top' }}
                  transition={{ duration: 0.3, ease: easeOut }}
                >
                  <PriceImpactAccordion
                    accordionButtonComponent={<SwapRate />}
                    accordionPanelComponent={<SwapDetails />}
                    isDisabled={!simulationQuery.data}
                    setNeedsToAcceptPIRisk={setNeedsToAcceptHighPI}
                  />
                </motion.div>
              )}

              {simulationQuery.isError ? (
                <ErrorAlert title="Error fetching swap">
                  {parseSwapError(simulationQuery.error?.message)}
                </ErrorAlert>
              ) : null}
            </VStack>
          </CardBody>
          <CardFooter>
            {isConnected ? (
              <Tooltip label={isDisabled ? disabledReason : ''}>
                <Button
                  isDisabled={isDisabled || !isMounted}
                  isLoading={isLoading}
                  loadingText={loadingText}
                  onClick={() => !isDisabled && previewModalDisclosure.onOpen()}
                  ref={nextBtn}
                  size="lg"
                  variant="secondary"
                  w="full"
                >
                  Next
                </Button>
              </Tooltip>
            ) : (
              <ConnectWallet
                isLoading={isLoading}
                loadingText={loadingText}
                size="lg"
                variant="primary"
                w="full"
              />
            )}
          </CardFooter>
        </Card>
      </Center>
      <TokenSelectModal
        chain={selectedChain}
        currentToken={tokenSelectKey === 'tokenIn' ? tokenIn.address : tokenOut.address}
        finalFocusRef={tokenSelectKey === 'tokenIn' ? finalRefTokenIn : finalRefTokenOut}
        isOpen={tokenSelectDisclosure.isOpen}
        onClose={tokenSelectDisclosure.onClose}
        onOpen={tokenSelectDisclosure.onOpen}
        onTokenSelect={handleTokenSelect}
        tokens={tokens}
      />
      <SwapPreviewModal
        finalFocusRef={nextBtn}
        isOpen={previewModalDisclosure.isOpen}
        onClose={onModalClose}
        onOpen={previewModalDisclosure.onOpen}
      />
    </FadeInOnView>
  )
}
