/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, test } from 'vitest'

import { poolId } from '@/lib/debug-helpers'
import { AddLiquidityConfigBuilder } from '@/lib/modules/steps/join/AddLiquidityConfigBuilder'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { getSdkTestUtils } from '@/test/integration/sdk-utils'
import { testHook } from '@/test/utils/custom-renderers'
import {
  defaultTestUserAccount,
  setWagmiDefaultRpcUrlForTests,
  testPublicClient as testClient,
} from '@/test/utils/wagmi'
import { ChainId, HumanAmount } from '@balancer/sdk'
import { act, waitFor } from '@testing-library/react'
import { SendTransactionResult } from 'wagmi/actions'
import { buildJoinPoolLabels } from '../../steps/join/useConstructJoinPoolStep'
import { someTokenAllowancesMock } from '../../tokens/__mocks__/token.builders'

const chainId = ChainId.MAINNET
const port = 8555
const rpcUrl = `http://127.0.0.1:${port}/`
const account = defaultTestUserAccount

setWagmiDefaultRpcUrlForTests(rpcUrl)

const utils = await getSdkTestUtils({
  account,
  chainId,
  client: testClient,
  poolId, // Balancer Weighted wjAura and WETH,
})

const { getPoolTokens, poolStateInput, getPoolTokenBalances } = utils

const poolTokens = getPoolTokens()

describe('weighted join test', () => {
  //   const anvil = startAnvilInPort(port)
  //   afterAll(() => anvil.stop())

  test('Sends transaction after updating amount inputs', async () => {
    await utils.setupTokens([...getPoolTokens().map(() => '100' as HumanAmount), '100'])

    const builder = new AddLiquidityConfigBuilder(chainId, someTokenAllowancesMock, poolStateInput)

    poolTokens.forEach(t => builder.setAmountIn(t.address, '1'))

    const balanceBefore = await getPoolTokenBalances()

    // First simulation
    const { queryResult, config } = await builder.buildSdkAddLiquidityTxConfig(account)

    const { result } = testHook(() => {
      return useManagedSendTransaction(buildJoinPoolLabels(), config)
    })

    await waitFor(() => expect(result.current.executeAsync).toBeDefined())
    expect(queryResult.bptOut.amount).toBeGreaterThan(200000000000000000000n)

    // Second simulation
    poolTokens.forEach(t => builder.setAmountIn(t.address, '2'))

    const { queryResult: queryResult2, config: config2 } =
      await builder.buildSdkAddLiquidityTxConfig(defaultTestUserAccount)
    // Double approximately
    expect(queryResult2.bptOut.amount).toBeGreaterThan(520000000000000000000n)

    // act(() => result.current.setTxConfig(config2))

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

    const balanceDeltas = await act(async () =>
      utils.calculateBalanceDeltas(balanceBefore, transactionReceipt)
    )

    // Confirm final balance changes match query result
    const expectedDeltas = [
      ...queryResult2.amountsIn.map(a => a.amount),
      queryResult2.bptOut.amount,
    ]

    // Wait for the sdk to be completed
    // expect(expectedDeltas).to.deep.eq(balanceDeltas)
  })
})
