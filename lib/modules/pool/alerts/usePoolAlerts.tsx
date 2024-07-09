import { zeroAddress } from 'viem'
import { Pool } from '../PoolProvider'
import { ReactNode, useEffect, useState } from 'react'
import { getNetworkConfig } from '@/lib/config/app.config'
import { AlertStatus } from '@chakra-ui/react'
import { PoolIssue } from './pool-issues/PoolIssue.type'
import { VulnerabilityDataMap } from './pool-issues/PoolIssue.labels'
import { isNil } from 'lodash'
import { hasReviewedRateProvider } from '../pool.helpers'
import { GqlPoolTokenDetail } from '@/lib/shared/services/api/generated/graphql'

export type PoolAlert = {
  identifier: string
  title: string | ReactNode
  learnMoreLink?: string
  status: AlertStatus
  isSoftWarning: boolean
}

export function usePoolAlerts(pool: Pool) {
  const [poolAlerts, setPoolAlerts] = useState<PoolAlert[]>([])

  const getNetworkPoolAlerts = (pool: Pool): PoolAlert[] => {
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

  const getTokenPoolAlerts = (pool: Pool): PoolAlert[] => {
    const poolTokens = pool.poolTokens as GqlPoolTokenDetail[]

    const alerts: PoolAlert[] = []

    poolTokens?.forEach(token => {
      if (!token.isAllowed) {
        alerts.push({
          identifier: `TokenNotAllowed-${token.symbol}`,
          title: `The token ${token.symbol} is currently not supported.`,
          status: 'error',
          isSoftWarning: false,
        })
      }

      const isPriceRateProviderLegit =
        isNil(token.priceRateProvider) || // if null, we consider rate provider as zero address
        token.priceRateProvider === zeroAddress ||
        token.priceRateProvider === token.nestedPool?.address

      if (isNil(token.priceRateProviderData) && isPriceRateProviderLegit) {
        return
      }

      if (!hasReviewedRateProvider(token)) {
        alerts.push({
          identifier: `PriceProviderNotReviewed-${token.symbol}`,
          // eslint-disable-next-line max-len
          title: `The rate provider for ${token.symbol} has not been reviewed. For your safety, you can’t interact with this pool on this UI.`,
          status: 'error',
          isSoftWarning: true,
        })
      }

      if (token.priceRateProviderData?.summary !== 'safe') {
        alerts.push({
          identifier: `UnsafePriceProvider-${token.symbol}`,
          // eslint-disable-next-line max-len
          title: `The rate provider for ${token.symbol} has been reviewed as ‘unsafe’. For your safety, you can’t interact with this pool on this UI. `,
          status: 'error',
          isSoftWarning: true,
        })
      }

      if (
        hasReviewedRateProvider(token) &&
        token.priceRateProviderData?.summary === 'safe' &&
        token.priceRateProviderData?.warnings &&
        token.priceRateProviderData?.warnings.length > 0
      ) {
        alerts.push({
          identifier: `PriceProviderWithWarnings-${token.symbol}`,
          // eslint-disable-next-line max-len
          title: `The rate provider for ${token.symbol} has been reviewed as ‘safe’ but with warnings. Please review in the Pool contracts section.`,
          status: 'error',
          isSoftWarning: true,
        })
      }
    })

    return alerts
  }

  useEffect(() => {
    const networkPoolAlerts = getNetworkPoolAlerts(pool)
    const tokenPoolAlerts = getTokenPoolAlerts(pool)

    setPoolAlerts([...networkPoolAlerts, ...tokenPoolAlerts])
  }, [pool])

  return {
    poolAlerts,
    setPoolAlerts,
  }
}
