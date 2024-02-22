import { AddLiquidityProvider } from '@/lib/modules/pool/actions/add-liquidity/useAddLiquidity'
import { PoolVariant } from '@/lib/modules/pool/pool.types'
import { PoolProvider } from '@/lib/modules/pool/usePool'
import {
  defaultGetTokenPricesQueryMock,
  defaultGetTokensQueryMock,
  defaultGetTokensQueryVariablesMock,
} from '@/lib/modules/tokens/__mocks__/token.builders'
import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { RecentTransactionsProvider } from '@/lib/modules/transactions/RecentTransactionsProvider'
import { UserSettingsProvider } from '@/lib/modules/user/settings/useUserSettings'
import { createWagmiConfig } from '@/lib/modules/web3/Web3Provider'
import { AbiMap } from '@/lib/modules/web3/contracts/AbiMap'
import { WriteAbiMutability } from '@/lib/modules/web3/contracts/contract.types'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'
import { GqlChain, GqlPoolElement } from '@/lib/shared/services/api/generated/graphql'
import { ApolloProvider } from '@apollo/client'
import { RenderHookOptions, act, renderHook, waitFor } from '@testing-library/react'
import { PropsWithChildren, ReactElement, ReactNode } from 'react'
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
import { aGqlPoolElementMock } from '../msw/builders/gqlPoolElement.builders'
import { apolloTestClient } from './apollo-test-client'
import { AppRouterContextProviderMock } from './app-router-context-provider-mock'
import { createWagmiTestConfig } from './wagmi/wagmi-test-setup'
import { RemoveLiquidityProvider } from '@/lib/modules/pool/actions/remove-liquidity/useRemoveLiquidity'
import { UserAccountProvider } from '@/lib/modules/web3/useUserAccount'
import { ReactQueryClientProvider } from '@/app/react-query.provider'
import { defaultTestUserAccount } from '../anvil/anvil-setup'
import { createMockConnector } from './wagmi/wagmi-mock-connectors'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'

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
          <UserAccountProvider>
            <TokensProvider
              tokensData={defaultGetTokensQueryMock}
              tokenPricesData={defaultGetTokenPricesQueryMock}
              variables={defaultGetTokensQueryVariablesMock}
            >
              <UserSettingsProvider
                initCurrency={'USD'}
                initSlippage={'0.2'}
                initPoolListView={'list'}
                initEnableSignatures="yes"
              >
                <RecentTransactionsProvider>
                  <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
                </RecentTransactionsProvider>
              </UserSettingsProvider>
            </TokensProvider>
          </UserAccountProvider>
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
  contractAddress: string,
  contractId: M,
  functionName: F,
  args?: GetFunctionArgs<T[M], F>,
  additionalConfig?: Omit<
    UsePrepareContractWriteConfig<T[M], F, number>,
    'abi' | 'address' | 'functionName' | 'args'
  >
) {
  const { result } = testHook(() =>
    useManagedTransaction(
      contractAddress,
      contractId,
      functionName,
      {} as TransactionLabels,
      args,
      additionalConfig
    )
  )
  return result
}

/**
 * Called from integration tests to setup a connection with the default anvil test account (defaultTestUserAccount)
 */
export async function useConnectTestAccount() {
  function useConnectWallet() {
    const config = { connector: createMockConnector('MAINNET') }
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

export const DefaultAddLiquidityTestProvider = ({ children }: PropsWithChildren) => (
  <RelayerSignatureProvider>
    <AddLiquidityProvider>{children}</AddLiquidityProvider>
  </RelayerSignatureProvider>
)

export const DefaultRemoveLiquidityTestProvider = ({ children }: PropsWithChildren) => (
  <RelayerSignatureProvider>
    <RemoveLiquidityProvider>{children}</RemoveLiquidityProvider>
  </RelayerSignatureProvider>
)

/* Builds a PoolProvider that injects the provided pool data*/
export const buildDefaultPoolTestProvider =
  (pool: GqlPoolElement = aGqlPoolElementMock()) =>
  // eslint-disable-next-line react/display-name
  ({ children }: PropsWithChildren) => {
    return (
      <PoolProvider
        id={pool.id}
        chain={GqlChain.Mainnet}
        variant={PoolVariant.v2}
        data={{
          __typename: 'Query',
          pool,
        }}
        variables={{ id: pool.id, chain: pool.chain, userAddress: defaultTestUserAccount }}
      >
        {children}
      </PoolProvider>
    )
  }

export const DefaultPoolTestProvider = buildDefaultPoolTestProvider(aGqlPoolElementMock())
