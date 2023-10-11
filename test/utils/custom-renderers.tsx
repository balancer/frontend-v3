import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { createWagmiConfig } from '@/lib/modules/web3/Web3Provider'
import { ApolloProvider } from '@apollo/client'
import { RenderHookOptions, renderHook } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { Config, WagmiConfig } from 'wagmi'
import { apolloTestClient } from './apollo-test-client'
import { AppRouterContextProviderMock } from './app-router-context-provider-mock'
import { createWagmiTestConfig } from './wagmi'
import { QueryParamAdapter, QueryParamProvider } from 'use-query-params'
import { waitFor } from '@testing-library/react'

export type WrapperProps = { children: ReactNode }
export type Wrapper = ({ children }: WrapperProps) => ReactNode

export const EmptyWrapper = ({ children }: WrapperProps) => <>{children}</>

export function testHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>
) {
  function MixedProviders({ children }: { children: ReactElement }): ReactElement {
    const LocalProviders = options?.wrapper || EmptyWrapper

    return (
      <GlobalProviders>
        <LocalProviders>{children}</LocalProviders>
      </GlobalProviders>
    )
  }

  const result = renderHook<TResult, TProps>(hook, {
    ...options,
    wrapper: MixedProviders,
  })
  return {
    ...result,
    waitForLoadedUseQuery,
  }
}

function GlobalProviders({ children }: WrapperProps) {
  const defaultRouterOptions = {}
  let wagmiConfig: Config
  if (process.env.VITE_USE_PRODUCTION_WAGMI == 'true') {
    wagmiConfig = createWagmiConfig() as Config
  } else {
    wagmiConfig = createWagmiTestConfig() as Config
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <AppRouterContextProviderMock router={defaultRouterOptions}>
        <ClientProvidersMock>
          <ApolloProvider client={apolloTestClient}>
            <TokensProvider>{children}</TokensProvider>
          </ApolloProvider>
        </ClientProvidersMock>
      </AppRouterContextProviderMock>
    </WagmiConfig>
  )
}

function ClientProvidersMock({ children }: React.PropsWithChildren) {
  return <QueryParamProvider adapter={NextAdapterAppMock}>{children}</QueryParamProvider>
}

type Props = {
  children(adapter: QueryParamAdapter): ReactElement | null
}

function NextAdapterAppMock({ children }: Props) {
  const adapter = {
    replace: vi.fn(),
    push: vi.fn(),
    location: { search: '' },
  }
  return children(adapter)
}

/**
 *
 * Helper to await for useQuery to finish loading when testing hooks
 *
 * @param hookResult is the result of calling renderHookWithDefaultProviders
 *
 *  Example:
 *    const { result, waitForLoadedUseQuery } = testHook(() => _useMyHookUnderTest())
 *    await waitForLoadedUseQuery(result)
 *
 */
export async function waitForLoadedUseQuery(hookResult: { current: { loading: boolean } }) {
  await waitFor(() => expect(hookResult.current.loading).toBeFalsy())
}
