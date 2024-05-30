import { GqlChain, GqlPoolElement } from '@/lib/shared/services/api/generated/graphql'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { getSdkTestUtils } from '@/test/integration/sdk-utils'
import {
  aBalWethPoolElementMock,
  toGqlWeighedPoolMock,
} from '@/test/msw/builders/gqlPoolElement.builders'
import { testHook } from '@/test/utils/custom-renderers'
import { connectWith, connectWithDefaultUser } from '@/test/utils/wagmi/wagmi-connections'
import { mainnetTestPublicClient } from '@/test/utils/wagmi/wagmi-test-clients'
import { ChainId } from '@balancer/sdk'
import { waitFor } from '@testing-library/react'
import { getPoolMock } from '../__mocks__/getPoolMock'
import { useOnchainUserPoolBalances } from './useOnchainUserPoolBalances'

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

test('fetches onchain user balances when the pool has no gaugeAddress', async () => {
  const poolMockWithEmptyGaugeAddress = aBalWethPoolElementMock() // Provides 80BAL-20WETH pool by default
  // Empty staking address
  if (poolMockWithEmptyGaugeAddress.staking?.gauge?.gaugeAddress) {
    poolMockWithEmptyGaugeAddress.staking.gauge.gaugeAddress = ''
  }

  expect(poolMockWithEmptyGaugeAddress.staking?.gauge).toMatchInlineSnapshot(`
    {
      "__typename": "GqlPoolStakingGauge",
      "gaugeAddress": "",
      "id": "test gauge id",
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

test('@slow: fetches onchain user balances when the pool user is staked in a non-preferential gauge', async () => {
  const holder = '0xE0Dd0C6a3F0A34c5175b65Bbd227710d9A5E09c8'
  await connectWith(holder)
  const poolId = '0xeab6455f8a99390b941a33bbdaf615abdf93455e000200000000000000000a66' // Pool with user staked in non preferential gauge
  const pool = await getPoolMock(poolId, GqlChain.Polygon, holder)

  const result = await testUseChainPoolBalances(pool)

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.data[0].userBalance).toEqual({
    __typename: 'GqlPoolUserBalance',
    stakedBalance: '0',
    stakedBalanceUsd: 0,
    nonPreferentialStakedBalance: '52.364668984347889717',
    nonPreferentialStakedBalanceUsd: expect.any(Number),
    totalBalance: '52.364668984347889717',
    totalBalanceUsd: expect.any(Number),
    walletBalance: '0',
    walletBalanceUsd: 0,
  })
})
