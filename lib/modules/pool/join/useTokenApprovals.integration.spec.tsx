import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { DefaultTokenAllowancesTestProvider, testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { AmountToApprove } from './approvals'
import { useConstructTokenApprovals } from './useTokenApprovals'

function testUseTokenApprovals(amountsToApprove: AmountToApprove[]) {
  const { result } = testHook(() => useConstructTokenApprovals(amountsToApprove), {
    wrapper: DefaultTokenAllowancesTestProvider,
  })
  return result
}

const amountsToApprove = [
  { [wETHAddress]: 10n, [wjAuraAddress]: 10n },
] as unknown as AmountToApprove[]

test('useJoinApprovals', async () => {
  const result = testUseTokenApprovals(amountsToApprove)
  await waitFor(() => expect(result.current.isAllowancesLoading).toBeFalsy())

  expect(result.current).toMatchObject({
    filteredAmountsToApprove: [
      {
        [wETHAddress]: 10n,
        [wjAuraAddress]: 10n,
      },
    ],
    isAllowancesLoading: false,
  })

  expect(result.current.tokenApprovalSteps).toHaveLength(1)
})
