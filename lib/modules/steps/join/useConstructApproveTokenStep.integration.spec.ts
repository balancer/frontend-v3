import { wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { act, waitFor } from '@testing-library/react'
import { useConstructApproveTokenStep } from '../useConstructApproveTokenStep'

test('useConstructApprovalTokenStep returns a config when step is active', async () => {
  const { result } = testHook(() => {
    return useConstructApproveTokenStep(wjAuraAddress)
  })

  act(() => result.current.step.activateStep())

  await waitFor(() => expect(result.current.step.simulation.data).toBeDefined())

  expect(result.current.step.simulation.data?.mode).toBe('prepared')
})
