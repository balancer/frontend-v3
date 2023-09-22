'use client'

import { Button } from '@chakra-ui/react'
import { useManagedVaultWrite } from './Vault'

// Managed transactions, pass args via function
export function WriteExampleTwo() {
  const {
    write: setAuthorizer, // AG: This alias can get tricker when your call has many args
    txStatus,
    simulate: { isError: willTxFail },
  } = useManagedVaultWrite('setAuthorizer')

  function handleOnClick() {
    if (!willTxFail) {
      // can provide args here
      setAuthorizer?.({ args: ['0xExampleAuthorizer'] })
    }
  }

  return <Button onClick={handleOnClick}>Example Two</Button>
}
