import { getSdkTestUtils } from '@/test/integration/sdk-utils'
import {
  aGqlPoolElementMock,
  toGqlWeighedPoolMock,
} from '@/test/msw/builders/gqlPoolElement.builders'
import { buildDefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount, testPublicClient } from '@/test/utils/wagmi'
import { ChainId } from '@balancer/sdk'
import { waitFor } from '@testing-library/react'
import { useChainUserPoolBalances } from './useChainUserPoolBalances'

const poolMock = aGqlPoolElementMock() // Provides 80BAL-20WETH pool by default
const weightedPoolMock = toGqlWeighedPoolMock(poolMock)

async function testUseChainPoolBalances() {
  const { result } = testHook(
    () => {
      return useChainUserPoolBalances([weightedPoolMock])
    },
    { wrapper: buildDefaultPoolTestProvider(poolMock) }
  )

  return result
}

const utils = await getSdkTestUtils({
  account: defaultTestUserAccount,
  chainId: ChainId.MAINNET,
  client: testPublicClient,
  pool: poolMock, // 80BAL-20WETH
})

test('fetches onchain user balances', async () => {
  // Unstaked balance
  await utils.setUserPoolBalance('40')

  const result = await testUseChainPoolBalances()

  await waitFor(() => expect(result.current.enrichedPools).toHaveLength(1))

  const enrichedPool = result.current.enrichedPools[0]

  await waitFor(() =>
    expect(enrichedPool.userBalance?.unstakedPoolBalance).toBe(40000000000000000000n)
  )
})
