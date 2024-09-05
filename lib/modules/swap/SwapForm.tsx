'use client'

import { SafeAppAlert } from '@/lib/shared/components/alerts/SafeAppAlert'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  HStack,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { capitalize } from 'lodash'
import { useRef } from 'react'
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
  } = useSwap()
  const nextBtn = useRef(null)
  const isMounted = useIsMounted()
  const { isConnected } = useUserAccount()

  const isLoadingSwaps = simulationQuery.isLoading
  const isLoading = isLoadingSwaps || !isMounted
  const loadingText = isLoading ? 'Fetching swap...' : undefined

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
                {tokenIn && <div>tokenIn.address {tokenIn.address}</div>}
                {tokenOut && <div>tokenOut.address {tokenOut.address}</div>}
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
