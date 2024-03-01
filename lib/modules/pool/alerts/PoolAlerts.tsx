import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react'
import { usePool } from '../usePool'
import { PoolAlertProps, getAlertsFor } from './pool-alerts'

export function PoolAlerts() {
  const { pool } = usePool()

  return getAlertsFor(pool).map(alertProps => (
    <PoolAlert key={alertProps.title} {...alertProps}></PoolAlert>
  ))
}

export function PoolAlert({ title, description, status }: PoolAlertProps) {
  return (
    <Alert status={status} rounded="lg">
      <AlertIcon />
      <AlertTitle
        dangerouslySetInnerHTML={{ __html: title }}
        sx={{ a: { textDecoration: 'underline' } }} // TODO: define this styles in the theme
      />
      <AlertDescription dangerouslySetInnerHTML={{ __html: description }} />
    </Alert>
  )
}
