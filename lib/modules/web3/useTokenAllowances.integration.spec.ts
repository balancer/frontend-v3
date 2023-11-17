import { vaultV2Address, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { act, waitFor } from '@testing-library/react'
import { useTokenAllowances } from './useTokenAllowances'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { Address } from 'viem'

function testTokenAllowances(tokenAddresses: Address[]) {
  const { result } = testHook(() =>
    useTokenAllowances(defaultTestUserAccount, vaultV2Address, tokenAddresses)
  )
  return result
}

const tokenAddresses = [wETHAddress, wjAuraAddress]

test('fetches token allowances', async () => {
  const result = testTokenAllowances(tokenAddresses)
  await waitFor(() => expect(result.current.isAllowancesLoading).toBeFalsy())

  expect(result.current.allowances).toMatchInlineSnapshot(`
    {
      "0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f": 0n,
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 0n,
    }
  `)
})

test('allows refetching allowances', async () => {
  const result = testTokenAllowances(tokenAddresses)

  await waitFor(() => expect(result.current.isAllowancesLoading).toBeFalsy())

  act(() => {
    result.current.refetchAllowances()
  })

  expect(result.current.isAllowancesRefetching).toBeTruthy()
  await waitFor(() => expect(result.current.isAllowancesRefetching).toBeFalsy())
})
