import { waitFor } from '@testing-library/react'

/**
 *
 * Helper to await for useQuery to finish loading when testing hooks
 *
 * @param hookResult is the result of calling renderHookWithDefaultProviders
 *
 *  Example:
 *    const { result } = renderHookWithDefaultProviders(() => _useMyHookUnderTest())
 *    await waitForLoadedUseQuery(result)
 *
 */
export async function waitForLoadedUseQuery(hookResult: { current: { loading: boolean } }) {
  await waitFor(() => expect(hookResult.current.loading).toBeFalsy())
}
