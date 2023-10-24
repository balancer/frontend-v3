'use client'

import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Flex, VStack } from '@chakra-ui/react'
import { JoinPayload } from './JoinPayload'
import { useJoinPool } from './useJoinPool'
import { usePoolStateInput } from './usePoolStateInput'

export function JoinPool() {
  const { address: userAddress } = useUserAccount()
  const { chainId } = useNetworkConfig()

  const poolId = '0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512' // Balancer 50COMP-50wstETH

  const poolStateQuery = usePoolStateInput(poolId)

  const joinPayload = new JoinPayload(chainId, poolStateQuery.data)

  joinPayload.setAmountIn('0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', '1')
  joinPayload.setAmountIn('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '1')

  const joinQuery = useJoinPool(joinPayload, userAddress)

  return (
    <VStack width="full">
      <Flex>
        {joinQuery.isLoading ? 'Loading ' : ''}
        {userAddress
          ? `Pool with account ${joinQuery.data?.config.account}.
          Min Bpt out: ${joinQuery?.data?.minBptOut}`
          : 'Not connected'}
      </Flex>
    </VStack>
  )
}
