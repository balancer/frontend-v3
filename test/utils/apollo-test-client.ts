import './apollo-setup'
import { ApolloClient, DefaultOptions, HttpLink, InMemoryCache } from '@apollo/client'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import fetch from 'cross-fetch'

// Adds apollo debug error messages only in test environment
loadDevMessages()
loadErrorMessages()

const cache = new InMemoryCache()

const link = new HttpLink({
  uri: process.env.VITE_PUBLIC_BALANCER_API_URL, //Useful for returning real data before mocking the GQL operation

  // Use explicit cross-fetch so that outgoing requests
  // are captured and deferred until the Service Worker is ready.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fetch: (...args) => {
    return fetch(...args)
  },
})

// Disable cache in unit tests
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

export const apolloTestClient = new ApolloClient({
  cache,
  link,
  defaultOptions,
})
