import { testHook } from '@/test/utils/custom-renderers'
import { _useTokens } from './useTokens'
import { waitFor } from '@testing-library/react'
import {
  defaultGetTokenPricesQueryMock,
  defaultGetTokensQueryMock,
  defaultGetTokensQueryVariablesMock,
  defaultTokenMock,
} from './__mocks__/token.builders'
import { uniq } from 'lodash'

test('fetches tokens', async () => {
  const initTokensData = defaultGetTokensQueryMock
  const initTokenPricesData = defaultGetTokenPricesQueryMock
  const variables = defaultGetTokensQueryVariablesMock
  const { result } = testHook(() => _useTokens(initTokensData, initTokenPricesData, variables))

  expect(result.current.tokens).toEqual(uniq(initTokensData.tokens))
  expect(result.current.prices).toEqual(initTokenPricesData.tokenPrices)

  await waitFor(() => expect(result.current.tokens.length).toBeGreaterThan(0))

  expect(result.current.tokens).toMatchObject([defaultTokenMock])
})
