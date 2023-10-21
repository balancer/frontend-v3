// import dotenv from 'dotenv'
// pnpm test -- weightedJoin.integration.test.ts
import { beforeAll, describe, expect, test } from 'vitest'
// dotenv.config()

import { Address, Hex, parseUnits } from 'viem'

import { SdkTransactionConfig } from '@/lib/contracts/contract.types'
import { useManagedSendTransaction } from '@/lib/contracts/useManagedSendTransaction'
import { testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount, testPublicClient } from '@/test/utils/wagmi'
import {
  ChainId,
  JoinInput,
  JoinKind,
  PoolJoin,
  PoolStateInput,
  Slippage,
  Token,
  TokenAmount,
  UnbalancedJoinInput,
  getPoolAddress,
} from '@balancer/sdk'
import { act, waitFor } from '@testing-library/react'
import { SendTransactionResult } from 'wagmi/dist/actions'
import {
  buildPool,
  calculateBalanceDeltas,
  getBalances,
  setupTokens,
} from '../../app/debug/steps/helper'

type TxInput = {
  poolJoin: PoolJoin
  joinInput: JoinInput
  slippage: Slippage
  poolInput: PoolStateInput
  checkNativeBalance: boolean
}

const chainId = ChainId.MAINNET
const port = 8555
const rpcUrl = `http://127.0.0.1:${port}/`
const poolId = '0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512' // Balancer 50COMP-50wstETH

const testAddress: Address = defaultTestUserAccount

describe('weighted join test', () => {
  let txInput: TxInput
  let bptToken: Token

  //   const anvil = startAnvilInPort(port)

  //   afterAll(() => anvil.stop())
  const client = testPublicClient

  beforeAll(async () => {
    // const client = buildTestClient(mainnet, port)
    // setup mock api
    const api = new MockApi()

    // get pool state from api
    const poolInput = await api.getPool(poolId)

    txInput = {
      poolJoin: new PoolJoin(),
      slippage: Slippage.fromPercentage('1'), // 1%
      poolInput,
      joinInput: {} as JoinInput,
      checkNativeBalance: false,
    }

    // setup BPT token
    bptToken = new Token(chainId, poolInput.address, 18, 'BPT')
  })

  test.only('Refactored: with config update', async () => {
    const pool = buildPool(txInput.poolInput, true, chainId)

    await setupTokens(client, testAddress, pool, [
      ...txInput.poolInput.tokens.map(t => parseUnits('100', t.decimals)),
      parseUnits('100', 18),
    ])

    const poolTokens = pool.poolTokens()
    const amountsIn = poolTokens.map(t => TokenAmount.fromHumanAmount(t, '1'))

    // perform join query to get expected bpt out
    const joinInput: UnbalancedJoinInput = {
      amountsIn,
      chainId,
      rpcUrl,
      kind: JoinKind.Unbalanced,
      useNativeAssetAsWrappedAmountIn: true,
    }

    const callInput = {
      ...txInput,
      joinInput,
    }

    const tokensForBalanceCheck = pool.tokensForBalanceCheck()
    const balanceBefore = await getBalances(tokensForBalanceCheck)

    // First simulation
    const { queryResult, config } = await buildSdkTransactionConfig(callInput)

    const firstHook = testHook(() => {
      return useManagedSendTransaction(config)
    })

    const { result } = firstHook

    await waitFor(() => expect(result.current.sendTransactionAsync).toBeDefined())
    //TODO: estudiar por que esto va cambiando en el fork. NO deberia ser dinamico??
    expect(queryResult.bptOut.amount).toBeGreaterThan(260000000000000000000n)

    // Second simulation
    callInput.joinInput.amountsIn = poolTokens.map(t => TokenAmount.fromHumanAmount(t, '2'))

    const { queryResult: queryResult2, config: config2 } = await buildSdkTransactionConfig(
      callInput
    )
    // El doble aproximado
    expect(queryResult2.bptOut.amount).toBeGreaterThan(520000000000000000000n)

    act(() => result.current.setTxConfig(config2))

    await waitFor(() => expect(result.current.sendTransactionAsync).toBeDefined())

    const foo = await act(async () => {
      const res = (await result.current.sendTransactionAsync?.()) as SendTransactionResult
      expect(res.hash).toBeDefined()
      return res
    })

    const transactionReceipt = await client.waitForTransactionReceipt({
      hash: foo.hash,
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

  async function buildSdkTransactionConfig(txIp: TxInput) {
    const { poolJoin, poolInput, joinInput, slippage } = txIp

    const queryResult = await poolJoin.query(joinInput, poolInput)

    const { call, to, value, maxAmountsIn, minBptOut } = poolJoin.buildCall({
      ...queryResult,
      slippage,
      sender: testAddress,
      recipient: testAddress,
    })

    const config: SdkTransactionConfig = {
      account: testAddress,
      chainId: ChainId.MAINNET,
      data: call,
      to,
      value,
    }

    return { maxAmountsIn, minBptOut, queryResult, config }
  }
})

/*********************** Mock To Represent API Requirements **********************/

export class MockApi {
  public async getPool(id: Hex): Promise<PoolStateInput> {
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
      type: 'Weighted',
      tokens,
    }
  }
}

/******************************************************************************/
