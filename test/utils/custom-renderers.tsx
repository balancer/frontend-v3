import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { createProductionConfig } from '@/lib/modules/web3/Web3Provider'
import { ApolloProvider } from '@apollo/client'
import { RenderHookOptions, renderHook } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { Config, WagmiConfig } from 'wagmi'
import { apolloTestClient } from './apollo-test-client'
import { AppRouterContextProviderMock } from './app-router-context-provider-mock'
import { createWagmiTestConfig } from './wagmi'
import { NextIntlClientProvider } from 'next-intl'
import { QueryParamAdapter, QueryParamProvider } from 'use-query-params'

export type WrapperProps = { children: ReactNode }
export type Wrapper = ({ children }: WrapperProps) => ReactNode

export const EmptyWrapper = ({ children }: WrapperProps) => <>{children}</>

export function renderHookWithDefaultProviders<TResult, TProps>(
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

  return renderHook<TResult, TProps>(hook, {
    ...options,
    wrapper: MixedProviders,
  })
}

function GlobalProviders({ children }: WrapperProps) {
  const defaultRouterOptions = {}
  let wagmiConfig: Config
  if (process.env.VITE_USE_PRODUCTION_WAGMI == 'true') {
    wagmiConfig = createProductionConfig() as Config
  } else {
    wagmiConfig = createWagmiTestConfig() as Config
  }

  return (
    <NextIntlClientProvider locale={'en'} messages={{}}>
      <WagmiConfig config={wagmiConfig}>
        <AppRouterContextProviderMock router={defaultRouterOptions}>
          <ClientProvidersMock>
            <ApolloProvider client={apolloTestClient}>
              <TokensProvider>{children}</TokensProvider>
            </ApolloProvider>
          </ClientProvidersMock>
        </AppRouterContextProviderMock>
      </WagmiConfig>
    </NextIntlClientProvider>
  )
}

function ClientProvidersMock({ children }: React.PropsWithChildren) {
  return <QueryParamProvider adapter={NextAdapterApp}>{children}</QueryParamProvider>
}

type Props = {
  children(adapter: QueryParamAdapter): ReactElement | null
}

function NextAdapterApp({ children }: Props) {
  const adapter = {
    replace: vi.fn(),
    push: vi.fn(),
    location: { search: 'foo' },
  }
  return children(adapter)
}
