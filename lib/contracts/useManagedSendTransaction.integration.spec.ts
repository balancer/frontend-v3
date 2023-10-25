// import dotenv from 'dotenv'
// pnpm test -- weightedJoin.integration.test.ts
import { describe, expect, test } from 'vitest'

import { Address, parseUnits } from 'viem'

import { JoinPayload } from '@/app/(app)/debug2/JoinPayload'
import { useManagedSendTransaction } from '@/lib/contracts/useManagedSendTransaction'
import {
  buildPool,
  calculateBalanceDeltas,
  getBalances,
  setupTokens,
} from '@/test/integration/helper'
import { testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount, testPublicClient } from '@/test/utils/wagmi'
import { ChainId } from '@balancer/sdk'
import { act, waitFor } from '@testing-library/react'
import { SendTransactionResult } from 'wagmi/dist/actions'
import { MockApi } from '../balancer-api/MockApi'
import { chains } from '../modules/web3/Web3Provider'

const chainId = ChainId.MAINNET
const port = 8555
const rpcUrl = `http://127.0.0.1:${port}/`

//TODO: create setup to globally change this values for integration tests

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
chains[0].rpcUrls.public.http[0] = rpcUrl

const poolId = '0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512' // Balancer 50COMP-50wstETH

const testAddress: Address = defaultTestUserAccount

async function getPoolInput() {
  // const client = buildTestClient(mainnet, port)
  // setup mock api
  const api = new MockApi()

  // get pool state from api
  return await api.getPool(poolId)
}

describe('weighted join test', () => {
  //   const anvil = startAnvilInPort(port)

  //   afterAll(() => anvil.stop())
  const client = testPublicClient

  test.only('Refactored: with config update', async () => {
    const poolInput = await getPoolInput()
    const pool = buildPool(poolInput, true, chainId)

    await setupTokens(client, testAddress, pool, [
      ...poolInput.tokens.map(t => parseUnits('100', t.decimals)),
      parseUnits('100', 18),
    ])

    const payload = new JoinPayload(ChainId['MAINNET'], poolInput)

    const poolTokens = pool.poolTokens()
    poolTokens.forEach(t => payload.setAmountIn(t.address, '1'))

    const tokensForBalanceCheck = pool.tokensForBalanceCheck()
    const balanceBefore = await getBalances(tokensForBalanceCheck)

    // First simulation
    const { queryResult, config } = await payload.buildSdkJoinTxConfig(defaultTestUserAccount)

    const { result } = testHook(() => {
      return useManagedSendTransaction(config)
    })

    await waitFor(() => expect(result.current.executeAsync).toBeDefined())
    expect(queryResult.bptOut.amount).toBeGreaterThan(260000000000000000000n)

    // Second simulation
    poolTokens.forEach(t => payload.setAmountIn(t.address, '2'))

    const { queryResult: queryResult2, config: config2 } = await payload.buildSdkJoinTxConfig(
      defaultTestUserAccount
    )
    // El doble aproximado
    expect(queryResult2.bptOut.amount).toBeGreaterThan(520000000000000000000n)

    act(() => result.current.setTxConfig(config2))

    await waitFor(() => expect(result.current.executeAsync).toBeDefined())

    const res = await act(async () => {
      const res = (await result.current.executeAsync?.()) as SendTransactionResult
      expect(res.hash).toBeDefined()
      return res
    })

    const transactionReceipt = await client.waitForTransactionReceipt({
      hash: res.hash,
    })

    expect(transactionReceipt.status).to.eq('success')

    const balanceDeltas = await calculateBalanceDeltas(balanceBefore, pool, transactionReceipt)

    // console.log({ balanceDeltas })
    // Confirm final balance changes match query result
    const expectedDeltas = [
      ...queryResult2.amountsIn.map(a => a.amount),
      queryResult2.bptOut.amount,
    ]
    expect(expectedDeltas).to.deep.eq(balanceDeltas)
  })
})
