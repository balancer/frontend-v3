'use client'

import { SafeAppAlert } from '@/lib/shared/components/alerts/SafeAppAlert'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Card, CardBody, CardHeader, Center, HStack, VStack } from '@chakra-ui/react'
import { capitalize } from 'lodash'
import { ChainSelect } from '../chains/ChainSelect'
import { TransactionSettings } from '../user/settings/TransactionSettings'
import { useSwap } from './SwapProvider'

export function SwapForm() {
  const {
    tokenIn,
    tokenOut,
    selectedChain,
    simulationQuery,
    swapAction,
    setSelectedChain,
    setTokenInAmount,
  } = useSwap()

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
              <VStack w="full">
                {selectedChain && <div>selectedChain {selectedChain}</div>}
                {tokenIn && <div>tokenIn.address {tokenIn.address}</div>}
                {tokenOut && <div>tokenOut.address {tokenOut.address}</div>}
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Center>
    </FadeInOnView>
  )
}
