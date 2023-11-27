import { wjAuraAddress } from '@/lib/debug-helpers'
import { DefaultTokenAllowancesTestProvider, testHook } from '@/test/utils/custom-renderers'
import { act, waitFor } from '@testing-library/react'
import { useConstructApproveTokenStep } from '../useConstructApproveTokenStep'

test('useConstructApprovalTokenStep returns a config when step is active', async () => {
  const amountToAllow = 10n
  const { result } = testHook(() => useConstructApproveTokenStep(wjAuraAddress, amountToAllow), {
    wrapper: DefaultTokenAllowancesTestProvider,
  })

  act(() => result.current.activateStep())

  await waitFor(() => expect(result.current.simulation.data).toBeDefined())

  expect(result.current.simulation.data?.mode).toBe('prepared')
})
