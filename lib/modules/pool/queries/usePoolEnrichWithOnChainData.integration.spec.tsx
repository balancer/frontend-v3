import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { Pool } from '../PoolProvider'
import { getPoolMock } from '../__mocks__/getPoolMock'
import { usePoolEnrichWithOnChainData } from './usePoolEnrichWithOnChainData'

function testPoolEnrichWithOnChainData(pool: Pool) {
  const { result } = testHook(() => usePoolEnrichWithOnChainData(pool))
  return result
}

test('enriches V3 pool with on-chain data', async () => {
  const poolId = '0x7cf221fa36584f59a4f7fd7b946b8571c78e3692' // V3 Balancer 50 BAL 50 WETH (sepolia experimental)
  const pool = await getPoolMock(poolId, GqlChain.Sepolia, defaultTestUserAccount)

  // delete values to ensure that onchain data is used
  pool.dynamicData.totalLiquidity = '0'
  pool.dynamicData.totalShares = '0'

  const result = testPoolEnrichWithOnChainData(pool)

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.pool.dynamicData.totalLiquidity).toBe('40.05')
  expect(result.current.pool.dynamicData.totalShares).toBe('0.141421356237306671')
})

test('enriches V2 pool with on-chain data', async () => {
  const poolId = '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014' // V2 B-80BAL-20WETH

  const pool = await getPoolMock(poolId, GqlChain.Mainnet)

  // delete values to ensure that onchain data is used
  pool.dynamicData.totalLiquidity = '0'
  pool.dynamicData.totalShares = '0'

  const result = testPoolEnrichWithOnChainData(pool)

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(Number(result.current.pool.dynamicData.totalLiquidity)).toBe(186591818.53067032)
  expect(result.current.pool.dynamicData.totalLiquidity).toBe('186591818.53067031181') // Sum(api token balances  * mocked token prices (see defaultTokenPriceListMock))
  expect(result.current.pool.dynamicData.totalShares).toBe('6883048.899888295676914061')
})
