import { Alert, AlertDescription, AlertIcon, AlertStatus, AlertTitle } from '@chakra-ui/react'
import { usePool } from '../usePool'
import { Pool } from '../usePool'
import { getPoolIssueAlerts } from './pool-issues/PoolIssue.rules'

type Label = string

type Type = 'Vulnerability'

export type PoolAlertProps = {
  id: string // used as key when rendering a list of alerts
  type: Type
  title: JSX.Element
  description?: JSX.Element
  status: AlertStatus
  labels: Label[]
}

export interface PoolAlertRuleFunc {
  (pool: Pool): PoolAlertProps[] | undefined
}

export function getAlertsFor(pool: Pool): PoolAlertProps[] {
  return getPoolIssueAlerts(pool) || []
}

export function PoolAlerts() {
  const { pool } = usePool()

  return getAlertsFor(pool).map(alertProps => (
    <PoolAlert key={alertProps.id} {...alertProps}></PoolAlert>
  ))
}

export function PoolAlert({ title, description, status }: PoolAlertProps) {
  return (
    <Alert status={status} rounded="lg">
      <AlertIcon />
      <AlertTitle
        sx={{ a: { textDecoration: 'underline' } }} // TODO: define this styles in the theme
      >
        {title}
      </AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
