import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'
import fetch from 'cross-fetch'
import { apolloTestClient } from '../utils/apollo-test-client'

/*
Using the default node-fetch in node 18 causes a viem exception in integration tests
(Expected signal to be an instanceof AbortSignal)
Replacing fetch with cross-fetch implementation solves the issue
*/
global.fetch = fetch

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

// waitFor global timeout
// https://testing-library.com/docs/dom-testing-library/api-configuration/#asyncutiltimeout
configure({ asyncUtilTimeout: 10_000 })

beforeEach(() => {
  apolloTestClient.clearStore()
})
