import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import {
  defaultGetTokenPricesQueryMock,
  defaultGetTokensQueryMock,
  defaultGetTokensQueryVariablesMock,
  defaultTokenListMock,
} from './__mocks__/token.builders'
import { _useTokens } from './useTokens'
import { balAddress, wETHAddress } from '@/lib/debug-helpers'

const initTokensData = defaultGetTokensQueryMock
const initTokenPricesData = defaultGetTokenPricesQueryMock

function testUseTokens() {
  const variables = defaultGetTokensQueryVariablesMock
  const { result } = testHook(() => _useTokens(initTokensData, initTokenPricesData, variables))
  return result
}

test('fetches tokens', async () => {
  const result = testUseTokens()

  expect(result.current.tokens).toEqual(initTokensData.tokens)
  expect(result.current.prices).toEqual(initTokenPricesData.tokenPrices)

  await waitFor(() => expect(result.current.tokens.length).toBeGreaterThan(0))

  expect(result.current.tokens).toEqual(defaultTokenListMock)
})

test('gets a token by token address and chain', async () => {
  const result = testUseTokens()

  expect(result.current.getToken(wETHAddress, GqlChain.Mainnet)).toMatchInlineSnapshot(`
    {
      "__typename": "GqlToken",
      "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "chain": "MAINNET",
      "chainId": 1,
      "decimals": 18,
      "logoURI": "https://raw.githubusercontent.com/balancer/tokenlists/main/src/assets/images/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
      "name": "Wrapped Ether",
      "priority": 0,
      "symbol": "WETH",
      "tradable": true,
    }
  `)
})

test('gets a token by token address and current chain when chain is not provided', async () => {
  const result = testUseTokens()

  expect(result.current.getToken(wETHAddress, GqlChain.Mainnet)).toMatchInlineSnapshot(`
    {
      "__typename": "GqlToken",
      "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "chain": "MAINNET",
      "chainId": 1,
      "decimals": 18,
      "logoURI": "https://raw.githubusercontent.com/balancer/tokenlists/main/src/assets/images/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
      "name": "Wrapped Ether",
      "priority": 0,
      "symbol": "WETH",
      "tradable": true,
    }
  `)
})

test('gets a list of tokens from a list of token addresses', async () => {
  const result = testUseTokens()

  const tokenAddresses = [balAddress]

  expect(result.current.getTokensByTokenAddress(tokenAddresses, GqlChain.Mainnet))
    .toMatchInlineSnapshot(`
      {
        "0xba100000625a3754423978a60c9317c58a424e3d": {
          "__typename": "GqlToken",
          "address": "0xba100000625a3754423978a60c9317c58a424e3d",
          "chain": "MAINNET",
          "chainId": 1,
          "decimals": 18,
          "logoURI": "https://raw.githubusercontent.com/balancer/tokenlists/main/src/assets/images/tokens/0xba100000625a3754423978a60c9317c58a424e3d.png",
          "name": "Balancer",
          "priority": 0,
          "symbol": "BAL",
          "tradable": true,
        },
      }
    `)
})
