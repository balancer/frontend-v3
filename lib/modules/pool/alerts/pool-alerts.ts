import { AlertStatus } from '@chakra-ui/react'
import { Pool } from '../usePool'
import { getPoolIssueAlerts } from './pool-issues/PoolIssue.rules'

type Label = string

type Type = 'Vulnerability'

export type PoolAlertProps = {
  type: Type
  title: string
  description: string
  status: AlertStatus
  labels: Label[]
}

export interface PoolAlertRuleFunc {
  (pool: Pool): PoolAlertProps[] | undefined
}

export function getAlertsFor(pool: Pool): PoolAlertProps[] {
  return getPoolIssueAlerts(pool) || []
}
