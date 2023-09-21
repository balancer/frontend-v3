import { allFakeGqlTokens, fakeTokenBySymbol } from '@/test/data/all-gql-tokens.fake'
import { renderHookWithDefaultProviders } from '@/test/utils/custom-renderers'
import { act, waitFor } from '@testing-library/react'
import { TokenBase } from './token.types'
import { useTokenBalances } from './useTokenBalances'

const defaultTestAccount = '0x512fce9B07Ce64590849115EE6B32fd40eC0f5F3'

test('fetches balance for native asset token', async () => {
  const nativeAssetBasicToken: TokenBase = fakeTokenBySymbol('ETH')
  const { result } = renderHookWithDefaultProviders(() =>
    useTokenBalances(defaultTestAccount, [nativeAssetBasicToken])
  )

  expect(result.current.balances).toMatchInlineSnapshot(`
    [
      {
        "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "amount": 0n,
        "chainId": 1,
        "decimals": 18,
        "formatted": "0",
      },
    ]
  `)

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.balances).toMatchInlineSnapshot(`
    [
      {
        "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "amount": 220229249800527944n,
        "chainId": 1,
        "decimals": 18,
        "formatted": "0.220229249800527944",
      },
    ]
  `)
})

test('fetches token balance', async () => {
  const balBasicToken: TokenBase = fakeTokenBySymbol('BAL')

  const { result } = renderHookWithDefaultProviders(() =>
    useTokenBalances(defaultTestAccount, [balBasicToken])
  )

  expect(result.current.balances).toMatchInlineSnapshot('[]')

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.balances).toMatchInlineSnapshot(`
    [
      {
        "address": "0xba100000625a3754423978a60c9317c58a424e3d",
        "amount": 0n,
        "chainId": 1,
        "decimals": 18,
        "formatted": "0",
      },
    ]
  `)
})

test('refetches balances', async () => {
  const balBasicToken: TokenBase = fakeTokenBySymbol('BAL')

  const { result } = renderHookWithDefaultProviders(() =>
    useTokenBalances(defaultTestAccount, [balBasicToken])
  )

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  act(() => {
    result.current.refetch()
  })

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.balances).toMatchInlineSnapshot(`
    [
      {
        "address": "0xba100000625a3754423978a60c9317c58a424e3d",
        "amount": 0n,
        "chainId": 1,
        "decimals": 18,
        "formatted": "0",
      },
    ]
  `)
})

test('Should not return balances when user is not connected (account is empty) ', async () => {
  const balBasicToken: TokenBase = fakeTokenBySymbol('BAL')
  const nativeAssetToken: TokenBase = fakeTokenBySymbol('ETH')

  const testAccount = undefined
  const { result } = renderHookWithDefaultProviders(() =>
    useTokenBalances(testAccount, [balBasicToken, nativeAssetToken])
  )

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.balances).toMatchInlineSnapshot(`
    [
      {
        "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "amount": 0n,
        "chainId": 1,
        "decimals": 18,
        "formatted": "0",
      },
    ]
  `)
})

test.skip('Debug: should return balances of 50 tokens', async () => {
  const numberOfTokens = 50
  const { result } = renderHookWithDefaultProviders(() =>
    useTokenBalances(defaultTestAccount, allFakeGqlTokens.slice(0, numberOfTokens))
  )

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())
  expect(result.current.balances).toHaveLength(numberOfTokens)
})
