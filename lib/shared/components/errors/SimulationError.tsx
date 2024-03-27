import { Alert } from '@chakra-ui/react'

type Props = {
  simulationQuery: {
    isError: boolean
    error: any
  }
}
export function SimulationError({ simulationQuery }: Props) {
  if (!simulationQuery.isError) return

  return (
    <Alert rounded="md" status="error">
      {simulationQuery.error?.shortMessage || 'Simulation error'}
    </Alert>
  )
}
