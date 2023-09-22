'use client'

import { Box, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Address, useAccount, useWaitForTransaction } from 'wagmi'
import { usePrepareVaultWrite, useVaultWrite } from '../abi/generated'
import { useVaultContractAddress } from './Vault'
import { Flex } from '@chakra-ui/react'

export function WriteExampleOne() {
  const { address: userAddress, isConnecting, isDisconnected } = useAccount()

  // const { addTransaction } = useTrackTransaction();
  const [authorizerArgs, setAuthorizerArgs] = useState<[Address, Address, boolean] | undefined>() // AG: You need to explicitly repeat arg [Address] type here

  const vaultContractAddress = useVaultContractAddress()
  const balancerRelayer = '0xfeA793Aa415061C483D2390414275AD314B3F621'

  // contract simulation
  const {
    config,
    isError: willTxFail,
    error,
  } = usePrepareVaultWrite({
    address: vaultContractAddress,
    functionName: 'setRelayerApproval',
    args: authorizerArgs,
  })
  // sending
  const {
    write: setAuthorizer,
    data: setAuthorizerResult,
    error: setAuthorizerError,
  } = useVaultWrite(config)
  // confirming (if needed)
  const txStatus = useWaitForTransaction({ hash: setAuthorizerResult?.hash })

  /*
   AG: this could be extracted to a hook
  */
  // tracking globally
  useEffect(() => {
    if (setAuthorizerResult?.hash) {
      // addTransaction(setAuthorizerExampleOneHash?.hash)
    }
  }, [setAuthorizerResult?.hash])
  // effect to change authorizer args, could be an input change for example
  useEffect(() => {
    if (userAddress) {
      setAuthorizerArgs([userAddress, balancerRelayer, true])
    }
  }, [userAddress])

  function handleOnClick() {
    if (!willTxFail) {
      setAuthorizer?.()
    }
  }

  // <Box margin={2} padding={2}>{txStatus.isLoading ? 'txStatus loading' : 'txStatus not loading'}</Box>
  // <Box margin={2} padding={2}>txStatus {JSON.stringify(txStatus)}</Box>

  return (
    <Flex direction={{ base: 'column' }}>
      <Box margin={2} padding={2}>
        {setAuthorizerError
          ? setAuthorizerError.message.substring(0, 20)
          : 'Todo bien con setAutorizer'}
      </Box>
      <Box margin={2} padding={2}>
        hash {setAuthorizerResult?.hash}
      </Box>
      <Box margin={2} padding={2}>
        simulation {willTxFail ? 'TX WILL FAIL' : 'TX WILL PASS'}
      </Box>
      <Box margin={2} padding={2}>
        error {error?.message}
      </Box>
      <Box margin={2} padding={2}>
        <Button disabled={!setAuthorizer} onClick={handleOnClick}>
          Example One
        </Button>
      </Box>
    </Flex>
  )
}
