import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useConstructApproveRelayerStep } from './useConstructApproveRelayerStep'
import { useHasApprovedRelayer } from './useHasApprovedRelayer'

test('Runs relayer approval transaction and queries that it was approved', async () => {
  const { result } = testHook(() => useConstructApproveRelayerStep())

  await waitFor(() => expect(result.current.simulation.isSuccess).toBeTruthy())

  await act(() => result.current.executeAsync?.())

  await waitFor(() => expect(result.current.execution.isSuccess).toBeTruthy())

  const { result: result2 } = testHook(useHasApprovedRelayer)

  await waitFor(() => expect(result2.current.hasApprovedRelayer).toBeTruthy())
})
