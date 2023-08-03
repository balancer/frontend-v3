import { TokensContext, UseTokensResult } from '@/lib/modules/tokens/useTokens'
import { isSameAddress } from '@/lib/utils/addresses'
import { fakeGqlTokens } from '@/test/data/gql-tokens.fake'
import { ApolloProvider } from '@apollo/client'
import { RenderOptions, render } from '@testing-library/react'
import { ReactElement } from 'react'
import { apolloTestClient } from './apollo-test-client'

function fakeUseTokens(): UseTokensResult {
  const tokens = fakeGqlTokens as UseTokensResult['tokens']
  function getToken(address: string, chainId: number) {
    return tokens.find(
      token =>
        isSameAddress(token.address, address) && token.chainId === chainId
    )
  }

  return {
    tokens,
    getToken,
  }
}

export function renderWithDefaultProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function AllProviders({
    children,
  }: {
    children: React.ReactNode
  }): ReactElement {
    return (
      <ApolloProvider client={apolloTestClient}>
        <TokensContext.Provider value={fakeUseTokens()}>
          {children}
        </TokensContext.Provider>
      </ApolloProvider>
    )
  }
  const result = render(ui, {
    wrapper: AllProviders,
    ...options,
  })

  return { ...result }
}
