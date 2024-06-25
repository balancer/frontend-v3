/* eslint-disable max-len */
import { testHook } from '@/test/utils/custom-renderers'
import { notAllowedPoolMock } from '../__mocks__/notAllowedPoolMock'
import { usePoolAlerts } from './usePoolAlerts'
import { recoveryPoolMock } from '../__mocks__/recoveryPoolMock'

describe('Creates pool alerts for', () => {
  test('a pool with 2 not allowed tokens', () => {
    const { result } = testHook(() => usePoolAlerts(notAllowedPoolMock))

    expect(result.current.poolAlerts).toMatchInlineSnapshot(`
      [
        {
          "identifier": "TokenNotAllowed-MTLSTR",
          "isSoftWarning": false,
          "status": "error",
          "title": "The token MTLSTR is currently not supported.",
        },
        {
          "identifier": "TokenNotAllowed-EGX",
          "isSoftWarning": false,
          "status": "error",
          "title": "The token EGX is currently not supported.",
        },
      ]  
    `)
  })

  test('a pool with 2 vulnerability alerts', () => {
    const { result } = testHook(() => usePoolAlerts(recoveryPoolMock))

    expect(result.current.poolAlerts).toMatchInlineSnapshot(`
    [
      {
        "identifier": "eulerRecoveryModeWarning",
        "isSoftWarning": false,
        "learnMoreLink": "https://docs.balancer.fi/concepts/governance/emergency.html",
        "status": "error",
        "title": <React.Fragment>
          Due to an exploit on Euler, this pool has been set to recovery mode by the Emergency multisig
          . Proportional withdrawals are enabled in the UI and you are encouraged to withdraw as soon as possible.
        </React.Fragment>,
      },
      {
        "identifier": "cspPoolVulnWarning",
        "isSoftWarning": false,
        "learnMoreLink": "https://forum.balancer.fi/t/vulnerability-found-in-some-pools/5102/1",
        "status": "error",
        "title": <React.Fragment>
          A vulnerability has been discovered that affects this pool. Existing liquidity providers should remove liquidity immediately.
        </React.Fragment>,
      },
    ]
  `)
  })
})
