import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { createProductionConfig } from '@/lib/modules/web3/Web3Provider'
import { ApolloProvider } from '@apollo/client'
import { RenderHookOptions, RenderOptions, render, renderHook } from '@testing-library/react'
import { ReactElement } from 'react'
import { Config, WagmiConfig } from 'wagmi'
import { apolloTestClient } from './apollo-test-client'
import { AppRouterContextProviderMock } from './app-router-context-provider-mock'
import { createWagmiTestConfig } from './wagmi'

function AllProviders({ children }: { children: React.ReactNode }): ReactElement {
  const defaultRouterOptions = {}
  let wagmiConfig: Config
  if (process.env.VITE_USE_PRODUCTION_WAGMI == 'true') {
    wagmiConfig = createProductionConfig() as Config
  } else {
    wagmiConfig = createWagmiTestConfig() as Config
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <AppRouterContextProviderMock router={defaultRouterOptions}>
        <ApolloProvider client={apolloTestClient}>
          <TokensProvider>{children}</TokensProvider>
        </ApolloProvider>
      </AppRouterContextProviderMock>
    </WagmiConfig>
  )
}

export function renderHookWithDefaultProviders<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>
) {
  return renderHook<TResult, TProps>(hook, { ...options, wrapper: AllProviders })
}

export function renderWithDefaultProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const result = render(ui, {
    wrapper: AllProviders,
    ...options,
  })

  return { ...result }
}
