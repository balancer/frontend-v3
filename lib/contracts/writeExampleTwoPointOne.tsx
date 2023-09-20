'use client'

import { Button } from '@chakra-ui/react'
import { useManagedVaultWrite } from './Vault'
import { useEffect, useState } from 'react'
import { Address } from 'viem'

// Managed transactions, pass args via parent state
export function WriteExampleTwoPointOne() {
  const [authorizerArgs, setAuthorizerArgs] = useState<[Address] | undefined>()

  const {
    write: setAuthorizer,
    txStatus: exampleTwoPointOneTxStatus,
    simulate: { isError: willTxFail },
  } = useManagedVaultWrite('setAuthorizer')

  // effect to change authorizer args, could be an input change for example
  useEffect(() => {
    setAuthorizerArgs(['0xExample'])
  }, [])

  function handleClick() {
    if (!willTxFail) {
      setAuthorizer?.()
    }
  }

  return <Button onClick={handleClick}>Example Two</Button>
}
