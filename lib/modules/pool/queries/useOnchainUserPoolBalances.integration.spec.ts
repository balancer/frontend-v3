import { getSdkTestUtils } from '@/test/integration/sdk-utils'
import {
  aBalWethPoolElementMock,
  toGqlWeighedPoolMock,
} from '@/test/msw/builders/gqlPoolElement.builders'
import { testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount, testPublicClient } from '@/test/utils/wagmi'
import { ChainId } from '@balancer/sdk'
import { waitFor } from '@testing-library/react'
import { useOnchainUserPoolBalances } from './useOnchainUserPoolBalances'
import { GqlPoolElement } from '@/lib/shared/services/api/generated/graphql'

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
    client: testPublicClient,
    pool,
  })
}

test.only('fetches onchain user balances', async () => {
  const poolMock = aBalWethPoolElementMock() // Provides 80BAL-20WETH pool by default
  const utils = await createSdkUtils(poolMock)

  // sets pool wallet balance
  await utils.setUserPoolBalance('40')

  const result = await testUseChainPoolBalances(poolMock)

  await waitFor(() => expect(result.current.data[0].userBalance?.walletBalance).toBe('40'))
})

test.skip('fetches onchain user balances when the pool does not have staking info', async () => {
  const poolMock = aBalWethPoolElementMock() // Provides 80BAL-20WETH pool by default

  poolMock.staking = undefined

  const utils = await createSdkUtils(poolMock)

  // sets pool wallet balance
  await utils.setUserPoolBalance('50')

  const result = await testUseChainPoolBalances(poolMock)

  await waitFor(() => expect(result.current.data[0].userBalance?.walletBalance).toBe('50'))
})

test.skip('fetches onchain user balances when the pool has empty gaugeAddress', async () => {
  const poolMock = aBalWethPoolElementMock() // Provides 80BAL-20WETH pool by default

  // Empty staking address
  if (poolMock.staking?.gauge?.gaugeAddress) poolMock.staking.gauge.gaugeAddress = ''

  const utils = await createSdkUtils(poolMock)

  // sets pool wallet balance
  await utils.setUserPoolBalance('60')

  const result = await testUseChainPoolBalances(poolMock)

  await waitFor(() => expect(result.current.data[0].userBalance?.walletBalance).toBe('60'))
})
