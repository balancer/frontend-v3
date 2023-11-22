import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { RecentTransactionsProvider } from '@/lib/modules/transactions/RecentTransactionsProvider'
import { createWagmiConfig } from '@/lib/modules/web3/Web3Provider'
import { AbiMap } from '@/lib/modules/web3/contracts/AbiMap'
import { WriteAbiMutability } from '@/lib/modules/web3/contracts/contract.types'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'
import { ApolloProvider } from '@apollo/client'
import { RenderHookOptions, act, renderHook, waitFor } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { GetFunctionArgs, InferFunctionName } from 'viem'
import {
  Config,
  UsePrepareContractWriteConfig,
  WagmiConfig,
  // eslint-disable-next-line no-restricted-imports
  useAccount,
  useConnect,
  useWalletClient,
} from 'wagmi'
import { apolloTestClient } from './apollo-test-client'
import { AppRouterContextProviderMock } from './app-router-context-provider-mock'
import { createWagmiTestConfig, defaultTestUserAccount, mainnetMockConnector } from './wagmi'
import {
  defaultGetTokenPricesQueryMock,
  defaultGetTokensQueryMock,
  defaultGetTokensQueryVariablesMock,
} from '@/lib/modules/tokens/__mocks__/token.builders'

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
        <ApolloProvider client={apolloTestClient}>
          <TokensProvider
            tokensData={defaultGetTokensQueryMock}
            tokenPricesData={defaultGetTokenPricesQueryMock}
            variables={defaultGetTokensQueryVariablesMock}
          >
            <RecentTransactionsProvider>{children}</RecentTransactionsProvider>
          </TokensProvider>
        </ApolloProvider>
      </AppRouterContextProviderMock>
    </WagmiConfig>
  )
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

/**
 * Wrapper over testHook to test useManagedTransaction hook with full TS inference
 */
export function testManagedTransaction<
  T extends typeof AbiMap,
  M extends keyof typeof AbiMap,
  F extends InferFunctionName<T[M], string, WriteAbiMutability>
>(
  contractId: M,
  functionName: F,
  args?: GetFunctionArgs<T[M], F>,
  additionalConfig?: Omit<
    UsePrepareContractWriteConfig<T[M], F, number>,
    'abi' | 'address' | 'functionName' | 'args'
  >
) {
  const { result } = testHook(() =>
    useManagedTransaction(contractId, functionName, {} as TransactionLabels, args, additionalConfig)
  )
  return result
}

/**
 * Called from integration tests to setup a connection with the default anvil test account (defaultTestUserAccount)
 */
export async function useConnectTestAccount() {
  function useConnectWallet() {
    const config = { connector: mainnetMockConnector }
    return {
      account: useAccount(),
      connect: useConnect(config),
      walletClient: useWalletClient(),
    }
  }
  const { result } = testHook(useConnectWallet)

  await act(async () => result.current.connect.connect())
  await waitFor(() =>
    expect(result.current.connect.isSuccess && result.current.account.isConnected).toBeTruthy()
  )
  expect(result.current.walletClient).toBeDefined()

  expect(result.current.connect.data?.account).toBe(defaultTestUserAccount)

  return {
    account: result.current.account,
    connect: result.current.connect,
    walletClient: result.current.walletClient,
  }
}
