import { Address, PoolState, getPoolAddress } from '@balancer/sdk'
import { Hex } from 'viem'

/*
  Used by SDK PriceImpact tests
  Returns wstETH-rETH-sfrxETH pool
*/
export function aPhantomStablePoolStateInputMock(): PoolState {
  const poolId: Hex = '0x42ed016f826165c2e5976fe5bc3df540c5ad0af700000000000000000000058b' // wstETH-rETH-sfrxETH
  const wstETH: Address = '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0'
  const sfrxETH: Address = '0xac3e018457b222d93114458476f3e3416abbe38f'
  const rETH: Address = '0xae78736cd615f374d3085123a210448e74fc6393'

  const poolAddress = getPoolAddress(poolId) as Address

  const tokens = [
    {
      address: poolAddress,
      decimals: 18,
      index: 0,
    },
    {
      address: wstETH,
      decimals: 18,
      index: 1,
    },
    {
      address: sfrxETH,
      decimals: 18,
      index: 2,
    },
    {
      address: rETH,
      decimals: 18,
      index: 2,
    },
  ]

  return {
    id: poolId,
    address: poolAddress,
    type: 'COMPOSABLE_STABLE',
    tokens,
    balancerVersion: 2,
  }
}
