'use client'

import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { SafeAppAlert } from '@/lib/shared/components/alerts/SafeAppAlert'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { HumanAmount } from '@balancer/sdk'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  HStack,
  IconButton,
  Tooltip,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { capitalize } from 'lodash'
import { useRef } from 'react'
import { Repeat } from 'react-feather'
import { ChainSelect } from '../chains/ChainSelect'
import { TransactionSettings } from '../user/settings/TransactionSettings'
import { ConnectWallet } from '../web3/ConnectWallet'
import { useUserAccount } from '../web3/UserAccountProvider'
import { useSwap } from './SwapProvider'

export function SwapForm() {
  const {
    tokenIn,
    tokenOut,
    selectedChain,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    simulationQuery,
    swapAction,
    setSelectedChain,
    setTokenInAmount,
    setTokenOutAmount,
    setTokenSelectKey,
    switchTokens,
  } = useSwap()
  const tokenSelectDisclosure = useDisclosure()
  const nextBtn = useRef(null)
  const finalRefTokenIn = useRef(null)
  const finalRefTokenOut = useRef(null)
  const isMounted = useIsMounted()
  const { isConnected } = useUserAccount()

  const isLoadingSwaps = simulationQuery.isLoading
  const isLoading = isLoadingSwaps || !isMounted
  const loadingText = isLoading ? 'Fetching swap...' : undefined

  function openTokenSelectModal(tokenSelectKey: 'tokenIn' | 'tokenOut') {
    setTokenSelectKey(tokenSelectKey)
    tokenSelectDisclosure.onOpen()
  }

  return (
    <FadeInOnView>
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
              <TransactionSettings size="sm" />
            </HStack>
          </CardHeader>
          <CardBody as={VStack} align="start">
            <VStack spacing="md" w="full">
              <SafeAppAlert />
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
            </VStack>
          </CardBody>
          <CardFooter>
            {isConnected ? (
              <Tooltip label={isDisabled ? disabledReason : ''}>
                <Button
                  ref={nextBtn}
                  variant="secondary"
                  w="full"
                  size="lg"
                  isDisabled={isDisabled || !isMounted}
                  isLoading={isLoading}
                  loadingText={loadingText}
                  onClick={() => !isDisabled && previewModalDisclosure.onOpen()}
                >
                  Next
                </Button>
              </Tooltip>
            ) : (
              <ConnectWallet
                variant="primary"
                w="full"
                size="lg"
                isLoading={isLoading}
                loadingText={loadingText}
              />
            )}
          </CardFooter>
        </Card>
      </Center>
    </FadeInOnView>
  )
}
