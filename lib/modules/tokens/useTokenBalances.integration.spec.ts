import { allFakeGqlTokens, fakeTokenBySymbol } from '@/test/data/all-gql-tokens.fake'
import { testHook } from '@/test/utils/custom-renderers'
import { act, waitFor } from '@testing-library/react'
import { useTokenBalances } from './useTokenBalances'

test('fetches balance for native asset token', async () => {
  const nativeAssetBasicToken = fakeTokenBySymbol('ETH')
  const { result } = testHook(() => useTokenBalances([nativeAssetBasicToken]))

  await waitFor(() => expect(result.current.balances.length).toBe(1))

  expect(result.current.balances).toMatchInlineSnapshot(`
    [
      {
        "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "amount": 10000000000000000000000n,
        "chainId": 1,
        "decimals": 18,
        "formatted": "10000",
      },
    ]
  `)
})

test('fetches token balance', async () => {
  const balBasicToken = fakeTokenBySymbol('BAL')

  const { result } = testHook(() => useTokenBalances([balBasicToken]))

  expect(result.current.balances).toEqual([])

  await waitFor(() => expect(result.current.balances.length).toBe(1))

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

// TODO: this test behaves differently when running with ".only"
// FIX: reset useQuery wagmi client once we migrate to wagmi v2
test('refetches balances', async () => {
  const balBasicToken = fakeTokenBySymbol('BAL')

  const { result } = testHook(() => useTokenBalances([balBasicToken]))

  await waitFor(() => expect(result.current.isBalancesLoading).toBeFalsy())
  await waitFor(() => expect(result.current.balances.length).toBe(1))

  const refetchResult = await act(() => {
    return result.current.refetchBalances()
  })

  expect(result.current.isBalancesRefetching).toBeFalsy()

  expect(refetchResult.length).toBe(2)
  expect(refetchResult[0].isSuccess).toBeTruthy()

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
  const balBasicToken = fakeTokenBySymbol('BAL')
  const nativeAssetToken = fakeTokenBySymbol('ETH')

  const { result } = testHook(() => useTokenBalances([balBasicToken, nativeAssetToken]))

  await waitFor(() => expect(result.current.balances.length).toBe(2))
  expect(result.current.isBalancesLoading).toBeFalsy()

  expect(result.current.balances).toMatchInlineSnapshot(`
    [
      {
        "address": "0xba100000625a3754423978a60c9317c58a424e3d",
        "amount": 0n,
        "chainId": 1,
        "decimals": 18,
        "formatted": "0",
      },
      {
        "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "amount": 10000000000000000000000n,
        "chainId": 1,
        "decimals": 18,
        "formatted": "10000",
      },
    ]
  `)
})

test.skip('Debug: should return balances of 50 tokens', async () => {
  const numberOfTokens = 50
  const { result } = testHook(() => useTokenBalances(allFakeGqlTokens.slice(0, numberOfTokens)))

  await waitFor(() => expect(result.current.isBalancesLoading).toBeFalsy())
  expect(result.current.balances).toHaveLength(numberOfTokens)
})
