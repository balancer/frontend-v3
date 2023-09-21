'use client'

import { Button } from '@chakra-ui/react'
import { useManagedTransaction } from './contract'

export function WriteExampleThree() {
  const {
    simulate: { isError: willTxFail },
    write: setAuthorizer,
  } = useManagedTransaction('balancer.vault', 'joinPool')

  function handleOnClick() {
    if (!willTxFail) {
      // can provide args here
      setAuthorizer?.({ args: ['0xExampleAuthorizer'] })
    }
  }

  return <Button onClick={handleOnClick}>Example Three</Button>
}
