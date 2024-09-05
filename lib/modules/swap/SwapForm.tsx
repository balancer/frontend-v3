'use client'

import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { Card, CardBody, Center, VStack } from '@chakra-ui/react'
import { useSwap } from './SwapProvider'

export function SwapForm() {
  const { tokenIn, tokenOut, selectedChain } = useSwap()

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
