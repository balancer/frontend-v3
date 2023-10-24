import { MockApi } from '@/lib/balancer-api/MockApi'
import { testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { ChainId } from '@balancer/sdk'
import { waitFor } from '@testing-library/react'
import { JoinPayload } from './JoinPayload'
import { useJoinPool } from './useJoinPool'

const poolId = '0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512' // Balancer 50COMP-50wstETH

async function buildPayload() {
  const poolStateInput = await new MockApi().getPool(poolId)

  return new JoinPayload(ChainId.MAINNET, poolStateInput)
}

test('fetches join pool config when user is not connected', async () => {
  const payload = await buildPayload()
  const account = undefined
  const { result } = testHook(() => {
    return useJoinPool(payload, account)
  })

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  console.log(result.current.data?.config)
  expect(result.current.data).toBeUndefined()
})

test('fetches join pool config when user is connected', async () => {
  const payload = await buildPayload()

  payload.setAmountIn('0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', '1')
  payload.setAmountIn('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '1')

  const account = defaultTestUserAccount
  const { result } = testHook(() => useJoinPool(payload, account))

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  // console.log(result.current.config)
  expect(result.current.data?.config).toBeDefined()
  // This values will be the same if we keep the block between tests
  expect(result.current.data?.minBptOut).toBe(489377213800749905119n)

  // payload.setSlippage('2')

  // const { result: result2 } = testHook(() => useJoinPool(payload, account))

  // await waitFor(() => expect(result2.current.isLoading).toBeFalsy())
  // expect(result2.current.data?.config).toBeDefined()

  // expect(result2.current.data?.minBptOut).toBe(501079137955679016504n)
})

test('Join Payload', async () => {
  const payload = await buildPayload()

  payload.setAmountIn('0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', '1')
  payload.setAmountIn('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '1')

  const result = await payload.buildSdkJoinTxConfig(defaultTestUserAccount)

  expect(result.minBptOut).toBe(489377213800749905119n)

  payload.setSlippage('2')

  expect(payload.slippage.bps).toBe(200)

  const result2 = await payload.buildSdkJoinTxConfig(defaultTestUserAccount)

  expect(result2.minBptOut).toBe(484579397979173925657n)
})
