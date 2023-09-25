'use client'

import { Alert, Button, VStack } from '@chakra-ui/react'
import { useManagedTransaction } from './contract'

export function WriteExampleThree() {
  const {
    execution: { write: setAuthorizer },
    simulation: { error, isError: hasSimulationError },
  } = useManagedTransaction('balancer.vault', 'setAuthorizer', { args: ['0xAuthorizer'] })

  function handleOnClick() {
    setAuthorizer?.()
  }
  return (
    <VStack>
      {hasSimulationError && <Alert>{error?.toString()}</Alert>}
      <Button onClick={handleOnClick}>Example Three</Button>
    </VStack>
  )
}
