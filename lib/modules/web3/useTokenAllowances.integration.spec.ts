import { vaultV2Address, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { act, waitFor } from '@testing-library/react'
import { _useTokenAllowances } from './useTokenAllowances'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { Address } from 'viem'

function useTokenAllowances(tokenAddresses: Address[]) {
  const { result } = testHook(() =>
    _useTokenAllowances(defaultTestUserAccount, vaultV2Address, tokenAddresses)
  )
  return result
}

const tokenAddresses = [wETHAddress, wjAuraAddress]

test('fetches token allowances', async () => {
  const result = useTokenAllowances(tokenAddresses)
  await waitFor(() => expect(result.current.isAllowancesLoading).toBeFalsy())

  expect(result.current.allowances).toMatchInlineSnapshot(`
    [
      0n,
      0n,
    ]
  `)
})

test('allows refetching allowances', async () => {
  const result = useTokenAllowances(tokenAddresses)

  await waitFor(() => expect(result.current.isAllowancesLoading).toBeFalsy())

  act(() => {
    result.current.refetchAllowances()
  })

  expect(result.current.isAllowancesRefetching).toBeTruthy()
  await waitFor(() => expect(result.current.isAllowancesRefetching).toBeFalsy())
})
