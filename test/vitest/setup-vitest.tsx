import { server } from '@/test/msw/server'
import '@testing-library/jest-dom'
import { apolloTestClient } from '../utils/apollo-test-client'

// Avoid using next/image in tests
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// MSW SETUP
// Establish API mocking before all tests.
beforeAll(() => server.listen())
beforeEach(() => {
  apolloTestClient.clearStore()
  return server.listen()
})
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())
