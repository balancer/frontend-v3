/* eslint-disable max-len */
import { PoolIssue } from './PoolIssue.type'

const vulnerabilityTitle =
  'A vulnerability has been discovered that affects this pool. Existing liquidity providers should remove liquidity immediately.'

const eulerTitle =
  'Due to an exploit on Euler, this pool has been set to recovery mode by the <a href="https://docs.balancer.fi/concepts/governance/emergency.html" target="blank" rel="noreferrer" class="underline">Emergency multisig</a>.'

const vulnerabilityDisclosure = `This pool is affected by a vulnerability disclosed <a href="https://forum.balancer.fi/t/vulnerability-disclosure/3179" target="blank" rel="noreferrer" class="underline">here</a>.`

export function getVulnerabilityText(poolIssue: PoolIssue): string {
  switch (poolIssue) {
    case PoolIssue.PoolProtocolFeeVulnWarning:
      return `${vulnerabilityTitle} <a href="https://twitter.com/Balancer/status/1611363559685898247" target="blank" rel="noreferrer" class="underline">Read more</a>`

    case PoolIssue.PoolOwnerVulnWarningGovernanceMigrate:
      return `${vulnerabilityDisclosure} You're advised to migrate your liquidity.`

    case PoolIssue.PoolOwnerVulnWarningGovernanceWithdraw:
      return `This pool was deprecated due to a <a href="https://forum.balancer.fi/t/vulnerability-disclosure/3179" target="blank" rel="noreferrer" class="underline">vulnerability</a>. You're advised to withdraw your liquidity asap. Add it to the <a href="https://app.balancer.fi/#/ethereum/pool/0xa13a9247ea42d743238089903570127dda72fe4400000000000000000000035d" target="blank" rel="noreferrer" class="underline">upgraded pool</a> to participate in liquidity incentives.`

    case PoolIssue.PoolOwnerVulnWarningGovernance:
      return `${vulnerabilityDisclosure} Reach out on Discord if you need help creating a new pool with the same composition.`

    case PoolIssue.PoolOwnerVulnWarningEcosystem:
      return `${vulnerabilityDisclosure} Reach out on Discord if you need help creating a new pool with the same composition.`

    case PoolIssue.PoolOwnerVulnWarningEcosystemMigrate:
      return `${vulnerabilityDisclosure} You're advised to migrate your liquidity.`

    case PoolIssue.RenBTCWarning:
      return `You are strongly advised to withdraw any liquidity from this pool ASAP to avoid losses! Ideally you should withdraw in a proportional fashion to reduce price impact. The Ren 1.0 network is expected to be <a href="https://medium.com/renproject/moving-on-from-alameda-da62a823ce93" target="blank" rel="noreferrer" class="underline">sunset</a> in December 2022. This will render this version of the renBTC token as valueless, which will trend the overall pool value towards zero. Ren Protocol also strongly advises to <a href="https://twitter.com/renprotocol/status/1595807696296751104" target="blank" rel="noreferrer" class="underline">bridge all ren assets</a> back to their native chain ASAP to avoid being left holding a valueless token which can no longer be redeemed for the native asset.`

    case PoolIssue.CspPoolVulnWarning:
      return `${vulnerabilityTitle} <a href="https://forum.balancer.fi/t/vulnerability-found-in-some-pools/5102/1" target="blank" rel="noreferrer" class="underline">Read more</a>`

    case PoolIssue.EulerBoostedWarning:
      return `${eulerTitle} Euler has disabled the transferability of eTokens so withdrawals from this pool are not possible until that functionality is restored.`

    case PoolIssue.EulerRecoveryModeWarning:
      return `${eulerTitle} Proportional withdrawals are enabled in the UI and you are encouraged to withdraw as soon as possible.`

    case PoolIssue.FxPoolVulnWarning:
      return `Xave's FXPools are potentially affected by a bug. Xave recommends that LPs temporarily remove liquidity from this pool. <a href="https://twitter.com/XaveFinance/status/1725089131330756628" target="blank" rel="noreferrer" class="underline">Read more</a>`
  }

  // Default
  return `${vulnerabilityTitle}`
}
