import { vaultV2Address, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { useUserTokenAllowance } from './useUserTokenAllowance'

test('fetches token allowance (WETH)', async () => {
  const spenderAddress = vaultV2Address

  const { result } = testHook(() => {
    return useUserTokenAllowance(wETHAddress, spenderAddress)
  })

  await waitFor(() => expect(result.current.status).toBe('success'))
  expect(typeof result.current.data).toBe('bigint')
})

test('fetches token allowance (wjAura)', async () => {
  const spenderAddress = vaultV2Address

  const { result } = testHook(() => {
    return useUserTokenAllowance(wjAuraAddress, spenderAddress)
  })

  await waitFor(() => expect(result.current.status).toBe('success'))
  expect(typeof result.current.data).toBe('bigint')
})
