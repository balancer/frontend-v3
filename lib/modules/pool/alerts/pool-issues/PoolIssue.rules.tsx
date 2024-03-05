import { getNetworkConfig } from '@/lib/config/app.config'
import { PoolAlertProps, PoolAlertRuleFunc } from '../pool-alerts'
import { Pool } from '../../usePool'
import { PoolId } from '../../pool.types'
import { PoolIssue } from './PoolIssue.type'
import { getVulnerabilityText } from './PoolIssue.labels'

export const getPoolIssueAlerts: PoolAlertRuleFunc = (pool: Pool) => {
  const poolIssues = getNetworkConfig(pool.chain)?.issues?.PoolIssues

  if (!poolIssues) return

  return Object.keys(poolIssues)
    .map(issue => {
      const poolIds = poolIssues[issue as PoolIssue]
      if (!poolIds) return
      if (poolIds.includes(pool.id as PoolId)) return anAlert(issue as PoolIssue)
      return
    })
    .filter(w => w !== undefined) as PoolAlertProps[]
}

function anAlert(poolIssue: PoolIssue): PoolAlertProps {
  return {
    type: 'Vulnerability',
    status: 'error',
    title: getVulnerabilityText(poolIssue),
    labels: [],
  }
}
