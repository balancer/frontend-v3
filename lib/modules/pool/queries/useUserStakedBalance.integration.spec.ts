import { GqlChain, GqlPoolElement } from '@/lib/shared/services/api/generated/graphql'
import { userStakedInNonPreferentialGauge } from '@/test/anvil/anvil-setup'
import { testHook } from '@/test/utils/custom-renderers'
import { connectWith, disconnectWith } from '@/test/utils/wagmi/wagmi-connections'
import { waitFor } from '@testing-library/react'
import { getPoolMock } from '../__mocks__/getPoolMock'
import { useUserStakedBalance } from './useUserStakedBalance'

async function testUseChainPoolBalances(pool: GqlPoolElement) {
  const { result } = testHook(() => {
    return useUserStakedBalance([pool])
  })

  return result
}

describe('fetches onchain user balances', async () => {
  test('when the user is staked in a non-preferential gauge', async () => {
    await connectWith(userStakedInNonPreferentialGauge)
    const poolId = '0xeab6455f8a99390b941a33bbdaf615abdf93455e000200000000000000000a66' // Pool with user staked in non preferential gauge
    const holder = userStakedInNonPreferentialGauge
    const pool = await getPoolMock(poolId, GqlChain.Polygon, holder)

    const result = await testUseChainPoolBalances(pool)

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    const poolStakedBalances = result.current.stakedBalancesByPoolId[poolId]

    // Returns individual staked balances
    const firstStakedBalance = poolStakedBalances.positiveStakedBalances[0]
    expect(firstStakedBalance.gaugeAddress).toBe(
      '0x55ec14e951b1c25ab09132dae12363bea0d20105' // non preferential gauge address
    )
    expect(firstStakedBalance.isPreferential).toBeFalsy()
    expect(firstStakedBalance.stakedBalance).toBe('52.364668984347889717')
    expect(Number(firstStakedBalance.stakedBalanceUsd)).toBeGreaterThan(5)

    // Returns aggregated staked balances
    expect(poolStakedBalances.stakedBalance).toBe('0')
    expect(poolStakedBalances.nonPreferentialStakedBalance).toBe('52.364668984347889717')
    expect(Number(poolStakedBalances.stakedBalanceUsd)).toBe(0)
    expect(Number(poolStakedBalances.nonPreferentialStakedBalanceUsd)).toBeGreaterThan(5)

    await disconnectWith(userStakedInNonPreferentialGauge)
  })

  test('when the pool does not have non-preferential gauges', async () => {
    const poolId = '0x05f21bacc4fd8590d1eaca9830a64b66a733316c00000000000000000000087e' // Pool with only preferential gauge
    const holder = userStakedInNonPreferentialGauge
    const pool = await getPoolMock(poolId, GqlChain.Polygon, holder)

    const result = await testUseChainPoolBalances(pool)

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    expect(result.current.stakedBalancesByPoolId).toMatchInlineSnapshot(`
      {
        "0x05f21bacc4fd8590d1eaca9830a64b66a733316c00000000000000000000087e": {
          "allStakedBalances": [
            {
              "gaugeAddress": "0xa02883e738854a17a7cd37f0871e9c2c0ed8cf7f",
              "isPreferential": true,
              "poolId": "0x05f21bacc4fd8590d1eaca9830a64b66a733316c00000000000000000000087e",
              "rawStakedBalance": 0n,
              "stakedBalance": "0",
              "stakedBalanceUsd": "0",
            },
          ],
          "nonPreferentialRawStakedBalance": 0n,
          "nonPreferentialStakedBalance": "0",
          "nonPreferentialStakedBalanceUsd": "0",
          "positiveStakedBalances": [],
          "rawStakedBalance": 0n,
          "stakedBalance": "0",
          "stakedBalanceUsd": "0",
        },
      }
    `)
  })
})
