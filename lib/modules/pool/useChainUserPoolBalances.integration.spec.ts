import { getSdkTestUtils } from '@/test/integration/sdk-utils'
import { aGqlPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { buildDefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount, testPublicClient } from '@/test/utils/wagmi'
import { ChainId } from '@balancer/sdk'
import { waitFor } from '@testing-library/react'
import { useChainUserPoolBalances } from './useChainUserPoolBalances'

const poolMock = aGqlPoolElementMock() // Provides 80BAL-20WETH pool by default

async function testUseChainPoolBalances() {
  const { result } = testHook(
    () => {
      return useChainUserPoolBalances()
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

  await waitFor(() => expect(result.current.userBalance.totalBalance).toBeDefined())

  expect(result.current.userBalance).toMatchInlineSnapshot(`
    {
      "__typename": "GqlPoolUserBalance",
      "stakedBalance": "0",
      "stakedBalanceUsd": 0,
      "totalBalance": "0.0",
      "unstakedPoolBalance": 40000000000000000000n,
      "walletBalance": "0",
      "walletBalanceUsd": 0,
    }
  `)
})
