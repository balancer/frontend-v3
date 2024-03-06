import { getNetworkConfig } from '@/lib/config/app.config'
import { Pool } from '../../usePool'
import { PoolId } from '../../pool.types'
import { PoolIssue } from './PoolIssue.type'
import { getVulnerabilityJsx } from './PoolIssue.labels'
import { PoolAlertProps, PoolAlertRuleFunc } from '../PoolAlerts'

export const getPoolIssueAlerts: PoolAlertRuleFunc = (pool: Pool) => {
  const poolIssues = getNetworkConfig(pool.chain).pools?.issues

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
    id: poolIssue,
    type: 'Vulnerability',
    status: 'error',
    title: getVulnerabilityJsx(poolIssue),
    labels: [],
  }
}
