/* eslint-disable max-len */
import { poolId } from '@/lib/debug-helpers'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { parseUnits } from 'viem'
import { BPT_DECIMALS } from '../../../pool.constants'
import { removeLiquidityKeys } from './remove-liquidity-keys'

const bptIn = parseUnits('1', BPT_DECIMALS)

test('Generates expected query keys', () => {
  const result = removeLiquidityKeys.priceImpact({
    userAddress: defaultTestUserAccount,
    poolId,
    slippage: '0.2',
    bptIn,
  })
  expect(result).toMatchInlineSnapshot(
    `
    [
      "remove-liquidity",
      "price-impact",
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266:0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512:0.2:1000000000000000000:undefined",
    ]
  `
  )

  const result2 = removeLiquidityKeys.priceImpact({
    userAddress: defaultTestUserAccount,
    poolId,
    slippage: '0.3',
    bptIn,
  })

  expect(result).not.toEqual(result2)
})
