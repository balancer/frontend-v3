'use client'

import { Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Address, useWaitForTransaction } from 'wagmi'
import { usePrepareVaultWrite, useVaultWrite } from '../abi/generated'
import { useVaultContractAddress } from './Vault'

export function WriteExampleOne() {
  // const { addTransaction } = useTrackTransaction();
  const [authorizerArgs, setAuthorizerArgs] = useState<[Address] | undefined>()

  const vaultContractAddress = useVaultContractAddress()

  // contract simulation
  const { config, isError: willTxFail } = usePrepareVaultWrite({
    address: vaultContractAddress,
    functionName: 'setAuthorizer',
    args: authorizerArgs,
  })
  // sending
  const { write: setAuthorizer, data: setAuthorizerResult } = useVaultWrite(config)
  // confirming (if needed)
  const txStatus = useWaitForTransaction({ hash: setAuthorizerResult?.hash })

  // tracking globally
  useEffect(() => {
    if (setAuthorizerResult?.hash) {
      // addTransaction(setAuthorizerExampleOneHash?.hash)
    }
  }, [setAuthorizerResult?.hash])

  // effect to change authorizer args, could be an input change for example
  useEffect(() => {
    setAuthorizerArgs(['0xExample'])
  }, [])

  function handleOnClick() {
    if (!willTxFail) {
      setAuthorizer?.()
    }
  }

  return <Button onClick={handleOnClick}>Example One</Button>
}
