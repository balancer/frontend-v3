/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, test } from 'vitest'

import { poolId } from '@/lib/debug-helpers'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { getSdkTestUtils } from '@/test/integration/sdk-utils'
import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { testHook } from '@/test/utils/custom-renderers'
import { testPublicClient as testClient } from '@/test/utils/wagmi/wagmi-test-setup'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { ChainId, HumanAmount } from '@balancer/sdk'
import { act, waitFor } from '@testing-library/react'
import { SendTransactionResult } from 'wagmi/actions'
import { UnbalancedAddLiquidityHandler } from '../../pool/actions/add-liquidity/handlers/UnbalancedAddLiquidity.handler'
import { selectAddLiquidityHandler } from '../../pool/actions/add-liquidity/handlers/selectAddLiquidityHandler'
import { HumanAmountIn } from '../../pool/actions/liquidity-types'

const chainId = ChainId.MAINNET
const account = defaultTestUserAccount

const utils = await getSdkTestUtils({
  account,
  chainId,
  client: testClient,
  pool: aWjAuraWethPoolElementMock(), // Balancer Weighted wjAura and WETH,
})

const { getPoolTokens, getPoolTokenBalances } = utils

const poolTokens = getPoolTokens()

describe('weighted join test', () => {
  //   const anvil = startAnvilInPort(port)
  //   afterAll(() => anvil.stop())

  test('Sends transaction after updating amount inputs', async () => {
    await utils.setupTokens([...getPoolTokens().map(() => '100' as HumanAmount), '100'])

    const handler = selectAddLiquidityHandler(
      aWjAuraWethPoolElementMock()
    ) as UnbalancedAddLiquidityHandler

    const humanAmountsIn: HumanAmountIn[] = poolTokens.map(t => ({
      humanAmount: '1',
      tokenAddress: t.address,
    }))

    const queryOutput = await handler.simulate(humanAmountsIn)

    const txConfig = await handler.buildCallData({
      humanAmountsIn,
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
      queryOutput,
    })

    const { result } = testHook(() => {
      return useManagedSendTransaction({ init: 'foo', tooltip: 'bar' }, 1, txConfig)
    })

    await waitFor(() => expect(result.current.executeAsync).toBeDefined())

    const res = await act(async () => {
      const res = (await result.current.executeAsync?.()) as SendTransactionResult
      expect(res.hash).toBeDefined()
      return res
    })
    const transactionReceipt = await act(async () =>
      testClient.waitForTransactionReceipt({
        hash: res.hash,
      })
    )

    expect(transactionReceipt.status).to.eq('success')
  })
})
