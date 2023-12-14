/* eslint-disable max-len */
import networkConfig from '@/lib/config/networks/mainnet'
import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { HumanAmount } from '@balancer/sdk'
import { Address } from 'viem'
import { aPhantomStablePoolStateInputMock } from '../../../__mocks__/pool.builders'
import { Pool } from '../../../usePool'
import { selectRemoveLiquidityHandler } from '../selectRemoveLiquidityHandler'
import { HumanAmountIn } from '../../liquidity-types'

function selectUnbalancedHandler() {
  //TODO: refactor mock builders to build poolStateInput and pool at the same time
  return selectRemoveLiquidityHandler(aWjAuraWethPoolElementMock())
}

describe('When removing unbalanced liquidity for a weighted pool', () => {
  test('queries bptIn', async () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const handler = selectUnbalancedHandler()

    const result = await handler.queryRemoveLiquidity({
      humanAmountsIn,
    })

    expect(result.bptIn.amount).toBeGreaterThan(390000000000000000000n)
    expect(result.sdkQueryOutput).toBeDefined()
  })

  test('builds Tx Config', async () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const handler = selectUnbalancedHandler()

    const { sdkQueryOutput } = await handler.queryRemoveLiquidity({
      humanAmountsIn,
    })

    const inputs = {
      humanAmountsIn,
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
    }
    const result = await handler.buildRemoveLiquidityTx({ inputs, sdkQueryOutput })

    expect(result.to).toBe(networkConfig.contracts.balancer.vaultV2)
    expect(result.data).toBeDefined()
  })
})

describe('When adding unbalanced liquidity for an stable pool', () => {
  test('calculates price impact', async () => {
    const pool = aPhantomStablePoolStateInputMock() as Pool // wstETH-rETH-sfrxETH

    const handler = selectRemoveLiquidityHandler(pool)

    // wstETH-rETH-sfrxETH has 3 tokens + BPT token:
    // we use 0, 10, 100, 1000 as amounts
    const humanAmountsIn: HumanAmountIn[] = pool.tokens.map((token, i) => {
      return {
        humanAmount: (10 ** i).toString() as HumanAmount,
        tokenAddress: token.address as Address,
      }
    })

    const { sdkQueryOutput } = await handler.queryRemoveLiquidity({
      humanAmountsIn,
    })

    const inputs = {
      humanAmountsIn,
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
    }
    const result = await handler.buildRemoveLiquidityTx({ inputs, sdkQueryOutput })
    expect(result).toMatchInlineSnapshot(`
      {
        "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "chainId": 1,
        "data": "0x8bdb391342ed016f826165c2e5976fe5bc3df540c5ad0af700000000000000000000058b000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000042ed016f826165c2e5976fe5bc3df540c5ad0af70000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca0000000000000000000000000ac3e018457b222d93114458476f3e3416abbe38f000000000000000000000000ae78736cd615f374d3085123a210448e74fc6393000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008ac7230489e800000000000000000000000000000000000000000000000000056bc75e2d6310000000000000000000000000000000000000000000000000003635c9adc5dea0000000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000447d30a924395551d200000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000008ac7230489e800000000000000000000000000000000000000000000000000056bc75e2d6310000000000000000000000000000000000000000000000000003635c9adc5dea00000",
        "to": "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
        "value": 0n,
      }
    `)
  })
})
