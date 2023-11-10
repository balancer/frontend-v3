import { testHook } from '@/test/utils/custom-renderers'
import { _useTokens } from './useTokens'
import { waitFor } from '@testing-library/react'
import {
  defaultGetTokensQueryMock,
  defaultGetTokensQueryVariablesMock,
  defaultTokenBaseMock,
} from './__mocks__/token.builders'

test('fetches tokens', async () => {
  const initialData = defaultGetTokensQueryMock
  const variables = defaultGetTokensQueryVariablesMock
  const { result } = testHook(() => _useTokens(initialData, variables))

  expect(result.current.tokens).toEqual(initialData.tokens)

  await waitFor(() => expect(result.current.tokens.length).toBeGreaterThan(0))

  expect(result.current.tokens).toMatchObject([defaultTokenBaseMock])
})
