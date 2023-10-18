import { config } from '@/lib/config/app.config'
import { userAddressVar } from '@/lib/modules/user/useUserData'
import { ApolloLink, HttpLink } from '@apollo/client'
import {
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr'

const userMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    return {
      headers: {
        ...headers,
        AccountAddress: userAddressVar(),
      },
    }
  })

  return forward(operation)
})

export function createApolloClient() {
  const httpLink = new HttpLink({ uri: config.apiUrl })

  return new NextSSRApolloClient({
    ssrMode: typeof window === 'undefined',
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            userMiddleware,
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : ApolloLink.from([userMiddleware, httpLink]),
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        GqlToken: {
          keyFields: ['address'],
        },
        GqlTokenPrice: {
          keyFields: ['address'],
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
