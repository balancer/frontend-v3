import { testManagedTransaction } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { parseUnits } from 'viem'

test('relayer successful relayer approval transaction', async () => {
  const balancerRelayer = '0xfeA793Aa415061C483D2390414275AD314B3F621'

  const result = testManagedTransaction('balancer.vaultV2', 'setRelayerApproval', {
    args: [defaultTestUserAccount, balancerRelayer, true],
  })

  await waitFor(() => expect(result.current.simulation.isSuccess).toBeTruthy())

  await act(() => result.current.executeAsync())

  await waitFor(() => expect(result.current.execution.isSuccess).toBeTruthy())

  expect(typeof result.current.execution.data?.hash).toBe('string')

  await waitFor(() => expect(result.current.result.isSuccess).toBeTruthy())

  expect(typeof result.current.result.data?.gasUsed).toBe('bigint')
})

test.only('token approval transaction (wsETH)', async () => {
  // const wsETHAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

  const vault2 = '0xBA12222222228d8Ba445958a75a0704d566BF2C8'
  const result = testManagedTransaction('balancer.wsETH', 'approve', {
    args: [vault2, parseUnits('100', 18)],
  })

  await waitFor(() => expect(result.current.simulation.isSuccess).toBeTruthy())

  await act(() => result.current.executeAsync())

  await waitFor(() => expect(result.current.execution.isSuccess).toBeTruthy())

  expect(typeof result.current.execution.data?.hash).toBe('string')

  await waitFor(() => expect(result.current.result.isSuccess).toBeTruthy())

  expect(typeof result.current.result.data?.gasUsed).toBe('bigint')
})
