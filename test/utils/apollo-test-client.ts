import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import fetch from 'cross-fetch'

// Adds apollo debug error messages only in test environment
loadDevMessages()
loadErrorMessages()

const cache = new InMemoryCache()

const link = new HttpLink({
  uri: 'https://api-v3.balancer.fi/graphql', //Useful for returning real data before mocking the GQL operation

  // Use explicit cross-fetch so that outgoing requests
  // are captured and deferred until the Service Worker is ready.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fetch: (...args) => {
    return fetch(...args)
  },
})

export const apolloTestClient = new ApolloClient({
  cache,
  link,
})
