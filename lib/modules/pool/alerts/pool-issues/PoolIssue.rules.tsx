import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { Pool } from '../../PoolProvider'
import { PoolIssue } from './PoolIssue.type'
import { VulnerabilityDataMap } from './PoolIssue.labels'
import { AlertStatus } from '@chakra-ui/react'
import { zeroAddress } from 'viem'
import { isNil } from 'lodash'

export type PoolAlert = {
  identifier: string
  title: string | JSX.Element
  learnMoreLink?: string
  status: AlertStatus
  isSoftWarning: boolean
}

export const getNetworkPoolAlerts = (pool: Pool): PoolAlert[] => {
  const networkPoolsIssues = getNetworkConfig(pool.chain).pools?.issues

  if (!networkPoolsIssues) return []

  const poolIssues: string[] = []

  Object.keys(networkPoolsIssues).forEach(issue => {
    const poolIds = networkPoolsIssues[issue as PoolIssue]

    if (!poolIds) return
    if (!poolIds.includes(pool.id)) return

    poolIssues.push(issue)
  })

  return poolIssues.map(issue => {
    const vulnerabilityData = VulnerabilityDataMap[issue as PoolIssue]

    return {
      identifier: issue,
      title: vulnerabilityData.jsxTitle,
      learnMoreLink: vulnerabilityData.learnMoreLink,
      status: 'error',
      isSoftWarning: false,
    }
  })
}

export const getTokenPoolAlerts = (pool: Pool): PoolAlert[] => {
  const { poolTokens } = pool

  const alerts: PoolAlert[] = []

  poolTokens.forEach(token => {
    if (!token.isAllowed) {
      alerts.push({
        identifier: `TokenNotAllowed-${token.symbol}`,
        // eslint-disable-next-line max-len
        title: `The token ${token.symbol} is currently not supported.`,
        status: 'error',
        isSoftWarning: false,
      })
    }

    if (
      token.hasNestedPool ||
      isNil(token.priceRateProvider) ||
      token.priceRateProvider === zeroAddress
    ) {
      return
    }

    if (token.priceRateProviderData?.summary !== 'safe') {
      alerts.push({
        identifier: `UnsafePriceProvider-${token.symbol}`,
        // eslint-disable-next-line max-len
        title: `The price data provider for ${token.symbol} is currently deemed unreliable.`,
        status: 'error',
        isSoftWarning: false,
      })
    }

    token.priceRateProviderData?.warnings?.forEach(warning => {
      alerts.push({
        identifier: `PriceProviderWarning-${token.symbol}-${warning}`,
        title: `Attention: ${token.symbol} Price Provider Alert - ${warning}`,
        status: 'warning',
        isSoftWarning: true,
      })
    })
  })

  return alerts
}

export function isAffectedByCspIssue(pool: Pool) {
  return isAffectedBy(pool, PoolIssue.CspPoolVulnWarning)
}

export function checkIfHasIssuesWithAddLiquidity(pool: Pool) {
  return pool.poolTokens.some(token => {
    if (!token.isAllowed) return true
    if (token.hasNestedPool) return false
    if (token.priceRateProvider === zeroAddress) return false
    if (token.priceRateProviderData?.summary !== 'safe') return true

    return false
  })
}

function isAffectedBy(pool: Pool, poolIssue: PoolIssue) {
  const issues = getNetworkConfig(getChainId(pool.chain)).pools.issues
  const affectedPoolIds = issues[poolIssue] ?? []
  return affectedPoolIds.includes(pool.id.toLowerCase())
}
