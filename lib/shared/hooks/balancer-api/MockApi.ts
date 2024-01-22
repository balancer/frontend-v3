/*********************** Mock To Represent API Requirements **********************/

import { Hex, PoolState, getPoolAddress } from '@balancer/sdk'
import { Address } from 'wagmi'

export class MockApi {
  public getPool(id: Hex): PoolState {
    const tokens = [
      {
        address: '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f' as Address, // wjAURA
        decimals: 18,
        index: 0,
      },
      {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' as Address, // WETH
        decimals: 18,
        index: 1,
      },
    ]

    return {
      id,
      address: getPoolAddress(id) as Address,
      type: 'WEIGHTED',
      tokens,
      balancerVersion: 2,
    }
  }
}

/******************************************************************************/
