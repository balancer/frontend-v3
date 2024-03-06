/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
import { PoolIssue } from './PoolIssue.type'

const vulnerabilityTitle =
  'A vulnerability has been discovered that affects this pool. Existing liquidity providers should remove liquidity immediately. '

const eulerTitle = 'Due to an exploit on Euler, this pool has been set to recovery mode by the '

const emergencyMultisigLink = (
  <a
    href="https://docs.balancer.fi/concepts/governance/emergency.html"
    target="blank"
    rel="noreferrer"
  >
    Emergency multisig
  </a>
)

const vulnerabilityDisclosure = `This pool is affected by a vulnerability disclosed `
const vulnerabilityDisclosureLink = (
  <a
    href="https://forum.balancer.fi/t/vulnerability-disclosure/3179"
    target="blank"
    rel="noreferrer"
  >
    here
  </a>
)

export function getVulnerabilityJsx(poolIssue: PoolIssue): JSX.Element {
  switch (poolIssue) {
    case PoolIssue.PoolProtocolFeeVulnWarning:
      return (
        <div>
          {vulnerabilityTitle}
          <a
            href="https://twitter.com/Balancer/status/1611363559685898247"
            target="blank"
            rel="noreferrer"
          >
            Read more
          </a>
          .
        </div>
      )

    case PoolIssue.PoolOwnerVulnWarningGovernanceMigrate:
      return (
        <div>
          {vulnerabilityDisclosure}
          {vulnerabilityDisclosureLink}. You're advised to migrate your liquidity.
        </div>
      )
    case PoolIssue.PoolOwnerVulnWarningGovernanceWithdraw:
      return (
        <div>
          This pool was deprecated due to a{' '}
          <a
            href="https://forum.balancer.fi/t/vulnerability-disclosure/3179"
            target="blank"
            rel="noreferrer"
          >
            vulnerability
          </a>
          . You're advised to withdraw your liquidity asap. Add it to the{' '}
          <a
            href="https://app.balancer.fi/#/ethereum/pool/0xa13a9247ea42d743238089903570127dda72fe4400000000000000000000035d"
            target="blank"
            rel="noreferrer"
          >
            upgraded pool{' '}
          </a>
          to participate in liquidity incentives.
        </div>
      )

    case PoolIssue.PoolOwnerVulnWarningGovernance:
      return (
        <div>
          {vulnerabilityDisclosure}
          {vulnerabilityDisclosureLink}. Reach out on Discord if you need help creating a new pool
          with the same composition.
        </div>
      )

    case PoolIssue.PoolOwnerVulnWarningEcosystem:
      return (
        <div>
          {vulnerabilityDisclosure}
          {vulnerabilityDisclosureLink}. Reach out on Discord if you need help creating a new pool
          with the same composition.
        </div>
      )
    case PoolIssue.PoolOwnerVulnWarningEcosystemMigrate:
      return (
        <div>
          {vulnerabilityDisclosure}
          {vulnerabilityDisclosureLink}. You're advised to migrate your liquidity.
        </div>
      )

    case PoolIssue.RenBTCWarning:
      return (
        <div>
          You are strongly advised to withdraw any liquidity from this pool ASAP to avoid losses!
          Ideally you should withdraw in a proportional fashion to reduce price impact. The Ren 1.0
          network is expected to be{' '}
          <a
            href="https://medium.com/renproject/moving-on-from-alameda-da62a823ce93"
            target="blank"
            rel="noreferrer"
          >
            sunset
          </a>{' '}
          in December 2022. This will render this version of the renBTC token as valueless, which
          will trend the overall pool value towards zero. Ren Protocol also strongly advises to{' '}
          <a
            href="https://twitter.com/renprotocol/status/1595807696296751104"
            target="blank"
            rel="noreferrer"
          >
            bridge all ren assets
          </a>{' '}
          back to their native chain ASAP to avoid being left holding a valueless token which can no
          longer be redeemed for the native asset.
        </div>
      )

    case PoolIssue.CspPoolVulnWarning:
      return (
        <div>
          {vulnerabilityTitle}
          <a
            href="https://forum.balancer.fi/t/vulnerability-found-in-some-pools/5102/1"
            target="blank"
            rel="noreferrer"
          >
            Read more
          </a>
          .
        </div>
      )

    case PoolIssue.EulerBoostedWarning:
      return (
        <div>
          {eulerTitle} {emergencyMultisigLink}. Euler has disabled the transferability of eTokens so
          withdrawals from this pool are not possible until that functionality is restored.
        </div>
      )

    case PoolIssue.EulerRecoveryModeWarning:
      return (
        <div>
          {eulerTitle} {emergencyMultisigLink}. Proportional withdrawals are enabled in the UI and
          you are encouraged to withdraw as soon as possible.
        </div>
      )

    case PoolIssue.FxPoolVulnWarning:
      return (
        <div>
          Xave's FXPools are potentially affected by a bug. Xave recommends that LPs temporarily
          remove liquidity from this pool.{' '}
          <a
            href="https://twitter.com/XaveFinance/status/1725089131330756628"
            target="blank"
            rel="noreferrer"
          >
            Read more
          </a>
          .
        </div>
      )
  }

  // Default
  return <div>{vulnerabilityTitle}</div>
}
