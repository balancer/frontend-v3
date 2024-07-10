import { getNetworkConfig } from '@/lib/config/app.config'
import { GqlPoolTokenDetail } from '@/lib/shared/services/api/generated/graphql'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { AlertStatus, Box, HStack, Tooltip } from '@chakra-ui/react'
import { isNil } from 'lodash'
import { hasReviewedRateProvider } from '../pool.helpers'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { zeroAddress } from 'viem'
import { Pool } from '../PoolProvider'
import { migrateStakeTooltipLabel } from '../actions/stake.helpers'
import { shouldMigrateStake } from '../user-balance.helpers'
import { PoolAlertButton } from './PoolAlertButton'
import { VulnerabilityDataMap } from './pool-issues/PoolIssue.labels'
import { PoolIssue } from './pool-issues/PoolIssue.type'
import { getRateProviderWarnings } from '../pool.helpers'

export type PoolAlert = {
  identifier: string
  title: string | ReactNode
  learnMoreLink?: string
  status: AlertStatus
  isSoftWarning: boolean
}

export function usePoolAlerts(pool: Pool) {
  const pathname = usePathname()
  const router = useRouter()
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

      const warnings = getRateProviderWarnings(token.priceRateProviderData?.warnings || [])

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
        warnings.length > 0
      ) {
        alerts.push({
          identifier: `PriceProviderWithWarnings-${token.symbol}`,
          // eslint-disable-next-line max-len
          title: `The rate provider for ${token.symbol} has been reviewed as ‘safe’ but with warnings. Please review in the Pool contracts section.`,
          status: 'warning',
          isSoftWarning: true,
        })
      }
    })

    return alerts
  }

  const getUserAlerts = (pool: Pool): PoolAlert[] => {
    const alerts: PoolAlert[] = []

    function MigrateStakeTitle() {
      return (
        <HStack w="full">
          <Box>Migrate to the new veBAL staking gauge for future BAL liquidity incentives</Box>
          <Tooltip label={migrateStakeTooltipLabel}>
            <InfoOutlineIcon fontSize="sm" />
          </Tooltip>
          <PoolAlertButton onClick={() => router.push(`${pathname}/migrate-stake`)} top={-3}>
            Migrate
          </PoolAlertButton>
        </HStack>
      )
    }

    if (shouldMigrateStake(pool)) {
      alerts.push({
        identifier: 'shouldMigrateStake',
        title: MigrateStakeTitle(),
        status: 'warning',
        isSoftWarning: false,
      })
    }

    return alerts
  }

  useEffect(() => {
    const networkPoolAlerts = getNetworkPoolAlerts(pool)
    const tokenPoolAlerts = getTokenPoolAlerts(pool)
    const userAlerts = getUserAlerts(pool)

    setPoolAlerts([...networkPoolAlerts, ...tokenPoolAlerts, ...userAlerts])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool])

  return {
    poolAlerts,
    setPoolAlerts,
  }
}
