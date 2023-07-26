import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

let apolloClient: ApolloClient<any>

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

function createApolloClient() {
  //const keyArgs = ['where', ['poolIdIn']]

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: concat(
      userMiddleware,
      new HttpLink({ uri: 'https://api-v3.balancer.fi/graphql' })
    ),
    cache: new InMemoryCache({
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

export function getApolloClient() {
  if (!apolloClient) {
    apolloClient = createApolloClient()
  }

  return apolloClient
}
