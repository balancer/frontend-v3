import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { waitFor } from '@testing-library/react'
import { AmountToApprove } from './approvals'
import { useJoinApprovals } from './useJoinApprovals'

function testUseJoinApprovals(amountsToApprove: AmountToApprove[]) {
  const { result } = testHook(() => useJoinApprovals(defaultTestUserAccount, amountsToApprove))
  return result
}

const amountsToApprove = [
  { [wETHAddress]: 10n, [wjAuraAddress]: 10n },
] as unknown as AmountToApprove[]

test('useJoinApprovals', async () => {
  const result = testUseJoinApprovals(amountsToApprove)
  await waitFor(() => expect(result.current.isAllowancesLoading).toBeFalsy())

  expect(result.current).toMatchInlineSnapshot(`
    {
      "filteredAmountsToApprove": [
        {
          "0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f": 10n,
          "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 10n,
        },
      ],
      "isAllowancesLoading": false,
    }
  `)
})
