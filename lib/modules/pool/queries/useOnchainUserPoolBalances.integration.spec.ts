import { getSdkTestUtils } from '@/test/integration/sdk-utils'
import {
  aBalWethPoolElementMock,
  toGqlWeighedPoolMock,
} from '@/test/msw/builders/gqlPoolElement.builders'
import { testHook } from '@/test/utils/custom-renderers'
import { mainnetTestPublicClient } from '@/test/utils/wagmi/wagmi-test-clients'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { ChainId } from '@balancer/sdk'
import { waitFor } from '@testing-library/react'
import { useOnchainUserPoolBalances } from './useOnchainUserPoolBalances'
import { GqlPoolElement } from '@/lib/shared/services/api/generated/graphql'
import { connectWithDefaultUser } from '@/test/utils/wagmi/wagmi-connections'

async function testUseChainPoolBalances(pool: GqlPoolElement) {
  const weightedPoolMock = toGqlWeighedPoolMock(pool)
  const { result } = testHook(() => {
    return useOnchainUserPoolBalances([weightedPoolMock])
  })

  return result
}

async function createSdkUtils(pool: GqlPoolElement) {
  return getSdkTestUtils({
    account: defaultTestUserAccount,
    chainId: ChainId.MAINNET,
    client: mainnetTestPublicClient,
    pool,
  })
}

await connectWithDefaultUser()

test('fetches onchain user balances', async () => {
  const poolMock = aBalWethPoolElementMock() // Provides 80BAL-20WETH pool by default
  const utils = await createSdkUtils(poolMock)

  // sets pool wallet balance
  await utils.setUserPoolBalance('40')

  const result = await testUseChainPoolBalances(poolMock)

  await waitFor(() => expect(result.current.data[0].userBalance?.walletBalance).toBe('40'))
})

test('fetches onchain user balances when the pool does not have staking info', async () => {
  const poolMockWithUndefinedStaking = aBalWethPoolElementMock() // Provides 80BAL-20WETH pool by default
  poolMockWithUndefinedStaking.staking = undefined

  expect(poolMockWithUndefinedStaking.staking).toBeUndefined()

  const utils = await createSdkUtils(poolMockWithUndefinedStaking)

  // sets pool wallet balance
  await utils.setUserPoolBalance('50')

  const result = await testUseChainPoolBalances(poolMockWithUndefinedStaking)

  await waitFor(() => expect(result.current.data[0].userBalance?.walletBalance).toBe('50'))
})

test('fetches onchain user balances when the pool has empty gaugeAddress', async () => {
  const poolMockWithEmptyGaugeAddress = aBalWethPoolElementMock() // Provides 80BAL-20WETH pool by default
  // Empty staking address
  if (poolMockWithEmptyGaugeAddress.staking?.gauge?.gaugeAddress) {
    poolMockWithEmptyGaugeAddress.staking.gauge.gaugeAddress = ''
  }

  expect(poolMockWithEmptyGaugeAddress.staking?.gauge).toMatchInlineSnapshot(`
    {
      "__typename": "GqlPoolStakingGauge",
      "gaugeAddress": "",
      "id": "0x2d42910d826e5500579d121596e98a6eb33c0a1b",
      "rewards": [],
      "status": "ACTIVE",
      "version": 2,
      "workingSupply": "",
    }
  `)

  const utils = await createSdkUtils(poolMockWithEmptyGaugeAddress)

  // sets pool wallet balance
  await utils.setUserPoolBalance('60')

  const result = await testUseChainPoolBalances(poolMockWithEmptyGaugeAddress)

  await waitFor(() => expect(result.current.data[0].userBalance?.walletBalance).toBe('60'))
})
