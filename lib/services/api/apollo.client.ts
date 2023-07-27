import { ApolloClient, ApolloLink, HttpLink } from '@apollo/client'
import {
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr'

const userMiddleware = new ApolloLink((operation, forward) => {
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
})

export function createApolloClient() {
  //const keyArgs = ['where', ['poolIdIn']]
  const httpLink = new HttpLink({ uri: 'https://api-v3.balancer.fi/graphql' })

  return new ApolloClient({
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
