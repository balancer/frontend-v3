import { balAddress, wETHAddress } from '@/lib/debug-helpers'

import { mainnet } from 'wagmi'
import { aPoolStateInputMock } from '../../__mocks__/pool.builders'
import { AddLiquidityService } from './AddLiquidityService'
import { HumanAmountIn } from './add-liquidity.types'
import { queryAddLiquidity } from './queryAddLiquidity'

test('queries unbalanced add liquidity', async () => {
  const poolStateInput = aPoolStateInputMock()

  const humanAmountsIn: HumanAmountIn[] = [
    { humanAmount: '1', tokenAddress: wETHAddress },
    { humanAmount: '1', tokenAddress: balAddress },
  ]

  const addLiquidityBuilder = new AddLiquidityService(mainnet.id, poolStateInput, 'unbalanced')

  const queryResult = await queryAddLiquidity(addLiquidityBuilder, humanAmountsIn)
  expect(queryResult?.bptOut).toMatchInlineSnapshot(`
    TokenAmount {
      "amount": 149765566220323369100n,
      "decimalScale": 1000000000000000000n,
      "scalar": 1n,
      "scale18": 149765566220323369100n,
      "token": Token {
        "address": "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56",
        "chainId": 1,
        "decimals": 18,
        "name": undefined,
        "symbol": undefined,
        "wrapped": "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56",
      },
    }
  `)
})
