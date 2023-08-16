import '@testing-library/jest-dom'
import { apolloTestClient } from '../utils/apollo-test-client'
import { configure } from '@testing-library/react'

if (process.env.VITE_USE_PRODUCTION_WAGMI == 'true') {
  console.log('🚨  Running tests with production wagmi config  🚨')
}

// Avoid using next/image in tests
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// TODO: find a better way to mock connected/disconnected in component tests
vi.mock('wagmi', async () => {
  const actual = (await vi.importActual('wagmi')) as object
  return {
    ...actual,
    useAccount: () => ({
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    }),
  }
})

// waitFor global timeout
// https://testing-library.com/docs/dom-testing-library/api-configuration/#asyncutiltimeout
configure({ asyncUtilTimeout: 10_000 })

beforeEach(() => {
  apolloTestClient.clearStore()
})
