import { config } from '@/lib/config/app.config'
import { ApolloLink, HttpLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'

import {
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr'
import { captureException } from '@sentry/nextjs'

/*const userMiddleware = new ApolloLink((operation, forward) => {
  // add the user address to the headers
  operation.setContext(({ headers = {} }) => {
    return {
      headers: {
        ...headers,
        // AccountAddress: SET ACCOUNT ADDRESS,
        // ChainId: SET CHAIN ID,
      },
    }
  })

  return forward(operation)
})*/

export function createApolloClient() {
  //const keyArgs = ['where', ['poolIdIn']]
  const httpLink = new HttpLink({ uri: config.apiUrl })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        captureException(new Error(message), { level: 'fatal' })
      })
    }

    if (networkError) {
      // For now we use fatal level, we can adjust this if it becomes noisy
      captureException(networkError, { level: 'fatal' })
    }
  })

  return new NextSSRApolloClient({
    ssrMode: typeof window === 'undefined',
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
            errorLink,
          ])
        : ApolloLink.from([httpLink, errorLink]),
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        GqlToken: {
          keyFields: ['address', 'chainId'],
        },
        GqlTokenPrice: {
          keyFields: ['address', 'chain'],
        },
        GqlUserPoolBalance: {
          keyFields: ['poolId'],
        },
        Query: {
          fields: {
            //poolGetJoinExits: concatPagination(keyArgs),
            //poolGetSwaps: concatPagination(keyArgs),
            //userGetSwaps: concatPagination(keyArgs),
            //poolGetBatchSwaps: concatPagination(),
            userGetPoolBalances: {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              merge(existing = [], incoming: any[]) {
                return incoming
              },
            },
            userGetStaking: {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              merge(existing = [], incoming: any[]) {
                return incoming
              },
            },
            poolGetBatchSwaps: {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              merge(existing = [], incoming: any[]) {
                return incoming
              },
            },
          },
        },
      },
    }),
    queryDeduplication: true,
  })
}
