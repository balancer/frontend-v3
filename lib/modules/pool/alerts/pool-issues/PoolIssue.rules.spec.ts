import { recoveryPoolMock } from '../../__mocks__/recoveryPoolMock'
import { getPoolIssueAlerts } from './PoolIssue.rules'

describe('Creates pool alerts for', () => {
  test('a pool with CSP vulnerability', () => {
    expect(getPoolIssueAlerts(recoveryPoolMock)).toMatchInlineSnapshot(`
      [
        {
          "description": "",
          "labels": [],
          "status": "error",
          "title": "Due to an exploit on Euler, this pool has been set to recovery mode by the <a href="https://docs.balancer.fi/concepts/governance/emergency.html" target="blank" rel="noreferrer" class="underline">Emergency multisig</a>. Proportional withdrawals are enabled in the UI and you are encouraged to withdraw as soon as possible.",
          "type": "Vulnerability",
        },
        {
          "description": "",
          "labels": [],
          "status": "error",
          "title": "A vulnerability has been discovered that affects this pool. Existing liquidity providers should remove liquidity immediately. <a href="https://forum.balancer.fi/t/vulnerability-found-in-some-pools/5102/1" target="blank" rel="noreferrer" class="underline">Read more</a>",
          "type": "Vulnerability",
        },
      ]
    `)
  })
})
