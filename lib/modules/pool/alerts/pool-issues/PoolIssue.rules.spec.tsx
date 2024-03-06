/* eslint-disable max-len */
import { recoveryPoolMock } from '../../__mocks__/recoveryPoolMock'
import { getPoolIssueAlerts } from './PoolIssue.rules'

describe('Creates pool alerts for', () => {
  test('a pool with 2 vulnerability alerts', () => {
    expect(getPoolIssueAlerts(recoveryPoolMock)).toMatchInlineSnapshot(`
      [
        {
          "id": "eulerRecoveryModeWarning",
          "labels": [],
          "status": "error",
          "title": <div>
            Due to an exploit on Euler, this pool has been set to recovery mode by the 
             
            <a
              href="https://docs.balancer.fi/concepts/governance/emergency.html"
              rel="noreferrer"
              target="blank"
            >
              Emergency multisig
            </a>
            . Proportional withdrawals are enabled in the UI and you are encouraged to withdraw as soon as possible.
          </div>,
          "type": "Vulnerability",
        },
        {
          "id": "cspPoolVulnWarning",
          "labels": [],
          "status": "error",
          "title": <div>
            A vulnerability has been discovered that affects this pool. Existing liquidity providers should remove liquidity immediately. 
            <a
              href="https://forum.balancer.fi/t/vulnerability-found-in-some-pools/5102/1"
              rel="noreferrer"
              target="blank"
            >
              Read more
            </a>
            .
          </div>,
          "type": "Vulnerability",
        },
      ]
    `)
  })
})
