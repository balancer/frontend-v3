'use client'

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
import { AbiMap } from '@/lib/modules/web3/contracts/AbiMap'
import { WriteAbiMutability } from '@/lib/modules/web3/contracts/contract.types'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { GqlChain, GqlPoolElement } from '@/lib/shared/services/api/generated/graphql'
import { ApolloProvider } from '@apollo/client'
import { RenderHookOptions, renderHook, waitFor } from '@testing-library/react'
import { PropsWithChildren, ReactNode } from 'react'
import { ContractFunctionArgs, ContractFunctionName } from 'viem'
import { UseSimulateContractParameters, WagmiProvider } from 'wagmi'
import { aGqlPoolElementMock } from '../msw/builders/gqlPoolElement.builders'
import { apolloTestClient } from './apollo-test-client'
import { AppRouterContextProviderMock } from './app-router-context-provider-mock'
import { RemoveLiquidityProvider } from '@/lib/modules/pool/actions/remove-liquidity/useRemoveLiquidity'
import { UserAccountProvider } from '@/lib/modules/web3/useUserAccount'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'
import { SupportedChainId } from '@/lib/config/config.types'
import { testQueryClient } from './react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { testWagmiConfig } from '@/test/anvil/testWagmiConfig'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'

export type WrapperProps = { children: ReactNode }
export type Wrapper = ({ children }: WrapperProps) => ReactNode

export const EmptyWrapper = ({ children }: WrapperProps) => <>{children}</>

export function testHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps> | undefined
) {
  function MixedProviders({ children }: WrapperProps) {
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

  return (
    <WagmiProvider config={testWagmiConfig} reconnectOnMount={false}>
      <QueryClientProvider client={testQueryClient}>
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
                  initAcceptedPolicies={undefined}
                >
                  <RecentTransactionsProvider>{children}</RecentTransactionsProvider>
                </UserSettingsProvider>
              </TokensProvider>
            </UserAccountProvider>
          </ApolloProvider>
        </AppRouterContextProviderMock>
      </QueryClientProvider>
    </WagmiProvider>
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
  F extends ContractFunctionName<T[M], WriteAbiMutability>
>(
  contractAddress: string,
  contractId: M,
  functionName: F,
  chainId: SupportedChainId,
  args?: ContractFunctionArgs<T[M], WriteAbiMutability>,
  additionalConfig?: Omit<
    UseSimulateContractParameters<T[M], F>,
    'abi' | 'address' | 'functionName' | 'args'
  >
) {
  const { result } = testHook(() =>
    useManagedTransaction(
      contractAddress,
      contractId,
      functionName,
      {} as TransactionLabels,
      chainId,
      args,
      additionalConfig
    )
  )
  return result
}

export const DefaultAddLiquidityTestProvider = ({ children }: PropsWithChildren) => (
  <RelayerSignatureProvider>
    <TokenInputsValidationProvider>
      <AddLiquidityProvider>{children}</AddLiquidityProvider>
    </TokenInputsValidationProvider>
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
      <TransactionStateProvider>
        <PoolProvider
          id={pool.id}
          chain={GqlChain.Mainnet}
          variant={PoolVariant.v2}
          data={{
            __typename: 'Query',
            pool,
          }}
        >
          {children}
        </PoolProvider>
      </TransactionStateProvider>
    )
  }

export const DefaultPoolTestProvider = buildDefaultPoolTestProvider(aGqlPoolElementMock())
