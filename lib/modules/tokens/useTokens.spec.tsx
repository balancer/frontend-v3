import { renderHookWithDefaultProviders } from '@/test/utils/custom-renderers'
import { _useTokens } from './useTokens'
import { waitFor } from '@testing-library/react'
import { defaultTokenBaseMock } from '@/test/msw/handlers/Tokens.handlers'

test('fetches tokens', async () => {
  const { result } = renderHookWithDefaultProviders(() => _useTokens())

  expect(result.current.tokens).toEqual([])

  await waitFor(() => expect(result.current.tokens.length).toBeGreaterThan(0))

  expect(result.current.tokens).toMatchObject([defaultTokenBaseMock])
})
