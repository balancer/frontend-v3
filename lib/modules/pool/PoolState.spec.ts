import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { PoolState } from './PoolState'

async function getPoolState() {
  const poolId = '0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512' // Balancer Weighted wjAura and WETH
  const poolStateInput = await new MockApi().getPool(poolId)
  const MAINNET = 1
  return new PoolState(poolStateInput, MAINNET)
}
describe('PoolState', async () => {
  test('getPoolTokens', async () => {
    const poolState = await getPoolState()

    expect(poolState.getPoolTokens()).toMatchInlineSnapshot(`
    [
      Token {
        "address": "0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f",
        "chainId": 1,
        "decimals": 18,
        "name": undefined,
        "symbol": undefined,
        "wrapped": "0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f",
      },
      Token {
        "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "chainId": 1,
        "decimals": 18,
        "name": undefined,
        "symbol": undefined,
        "wrapped": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      },
    ]
  `)
  })
})
