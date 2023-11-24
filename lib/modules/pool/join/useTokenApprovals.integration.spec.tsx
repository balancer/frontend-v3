import { vaultV2Address, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { AmountToApprove } from './approvals'
import { useConstructTokenApprovals } from './useTokenApprovals'
import { TokenAllowancesProvider } from '../../web3/useTokenAllowances'
import { PropsWithChildren } from 'react'
import { defaultTestUserAccount } from '@/test/utils/wagmi'

// Todo extract to reuse
const wrapper = ({ children }: PropsWithChildren) => (
  <TokenAllowancesProvider
    spenderAddress={vaultV2Address}
    tokenAddresses={[wETHAddress, wjAuraAddress]}
    userAddress={defaultTestUserAccount}
  >
    {children}
  </TokenAllowancesProvider>
)

function testUseTokenApprovals(amountsToApprove: AmountToApprove[]) {
  const { result } = testHook(() => useConstructTokenApprovals(amountsToApprove), { wrapper })
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
