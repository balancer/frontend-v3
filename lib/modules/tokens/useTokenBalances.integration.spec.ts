import { allFakeGqlTokens, fakeTokenBySymbol } from '@/test/data/all-gql-tokens.fake'
import { testHook } from '@/test/utils/custom-renderers'
import { act, waitFor } from '@testing-library/react'
import { useTokenBalances } from './useTokenBalances'

/*
THIS TEST ARE EXCLUDED IN vitest.config.ts until we fix the issues with useQuery key overflow
  exclude: ['lib/modules/tokens/useTokenBalances.integration.spec.ts', 'node_modules', 'dist'],
*/

test('fetches balance for native asset token', async () => {
  const nativeAssetBasicToken = fakeTokenBySymbol('ETH')
  const { result } = testHook(() => useTokenBalances([nativeAssetBasicToken]))

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

  await waitFor(() => expect(result.current.isBalancesLoading).toBeFalsy())

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
  const balBasicToken = fakeTokenBySymbol('BAL')

  const { result } = testHook(() => useTokenBalances([balBasicToken]))

  expect(result.current.balances).toMatchInlineSnapshot('[]')

  await waitFor(() => expect(result.current.isBalancesLoading).toBeFalsy())

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
  const balBasicToken = fakeTokenBySymbol('BAL')

  const { result } = testHook(() => useTokenBalances([balBasicToken]))

  await waitFor(() => expect(result.current.isBalancesLoading).toBeFalsy())

  act(() => {
    result.current.refetchBalances()
  })

  await waitFor(() => expect(result.current.isBalancesLoading).toBeFalsy())

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

// test('Should not return balances when user is not connected (account is empty) ', async () => {
//   const balBasicToken = fakeTokenBySymbol('BAL')
//   const nativeAssetToken = fakeTokenBySymbol('ETH')

//   const { result } = testHook(() => useTokenBalances([balBasicToken, nativeAssetToken]))

//   await waitFor(() => expect(result.current.isBalancesLoading).toBeFalsy())

//   expect(result.current.balances).toMatchInlineSnapshot(`
//     [
//       {
//         "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
//         "amount": 0n,
//         "chainId": 1,
//         "decimals": 18,
//         "formatted": "0",
//       },
//     ]
//   `)
// })

test.skip('Debug: should return balances of 50 tokens', async () => {
  const numberOfTokens = 50
  const { result } = testHook(() => useTokenBalances(allFakeGqlTokens.slice(0, numberOfTokens)))

  await waitFor(() => expect(result.current.isBalancesLoading).toBeFalsy())
  expect(result.current.balances).toHaveLength(numberOfTokens)
})
