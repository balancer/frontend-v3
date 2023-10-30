import { TransactionLabels } from '@/components/btns/transaction-steps/lib'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { parseUnits } from 'viem'
import { useManagedErc20Transaction } from './useManagedErc20Transaction'

test('token approval transaction (wETH)', async () => {
  const wEthAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

  const vault2 = '0xBA12222222228d8Ba445958a75a0704d566BF2C8'

  const { result } = testHook(() =>
    useManagedErc20Transaction(wEthAddress, 'approve', {} as TransactionLabels, {
      args: [vault2, parseUnits('100', 18)],
    })
  )

  await waitFor(() => expect(result.current.simulation.isSuccess).toBeTruthy())

  await act(() => result.current.executeAsync())

  await waitFor(() => expect(result.current.execution.isSuccess).toBeTruthy())

  expect(typeof result.current.execution.data?.hash).toBe('string')

  await waitFor(() => expect(result.current.result.isSuccess).toBeTruthy())

  expect(typeof result.current.result.data?.gasUsed).toBe('bigint')
})
