import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { Pool } from '../../usePool'
import { PoolId } from '../../pool.types'
import { PoolIssue } from './PoolIssue.type'
import { jsxTitleByVulnerability } from './PoolIssue.labels'
import { PoolAlertProps, PoolAlertRuleFunc } from '../PoolAlerts'
import { AlertStatus } from '@chakra-ui/react'

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
    status: getStatus(poolIssue),
    title: jsxTitleByVulnerability[poolIssue],
    labels: [],
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStatus(poolIssue: PoolIssue): AlertStatus {
  //For now, all issues are vulnerabilities with default error status
  return 'error'
}

export function isAffectedByCspIssue(pool: Pool) {
  return isAffectedBy(pool, PoolIssue.CspPoolVulnWarning)
}

function isAffectedBy(pool: Pool, poolIssue: PoolIssue) {
  const issues = getNetworkConfig(getChainId(pool.chain)).pools.issues
  const affectedPoolIds = issues[poolIssue] ?? []
  return affectedPoolIds.includes(pool.id.toLowerCase())
}
