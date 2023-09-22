'use client'

import { Box, Button, Flex } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useAccount, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useVaultWrite, vaultABI } from '../abi/generated'
import { useContractConfig } from './useGualisWriteContract'

export function WriteExampleFour() {
  const balancerRelayer = '0xfeA793Aa415061C483D2390414275AD314B3F621'
  const { address: userAddress, isConnecting, isDisconnected } = useAccount()

  const noConnectedUser = '0xNoUser'

  const contractConfig = useContractConfig({
    abi: vaultABI,
    functionName: 'setRelayerApproval',
    args: [userAddress || noConnectedUser, balancerRelayer, true],
  })

  // contract simulation
  const {
    config,
    isError: willTxFail,
    error,
  } = usePrepareContractWrite({
    ...contractConfig,
    enabled: !!userAddress,
  } as any) //This is safe because the typing is done in useContractConfig

  // sending
  const {
    write: setRelayerApproval,
    data: setRelayerApprovalResult,
    error: setRelayerApprovalError,
  } = useVaultWrite(config as any)

  // confirming (if needed)
  const txStatus = useWaitForTransaction({ hash: setRelayerApprovalResult?.hash })

  /*
   AG: this could be extracted to a hook
  */
  // tracking globally
  useEffect(() => {
    if (setRelayerApprovalResult?.hash) {
      // addTransaction(setAuthorizerExampleOneHash?.hash)
    }
  }, [setRelayerApprovalResult?.hash])
  // effect to change authorizer args, could be an input change for example
  // useEffect(() => {
  //   if (userAddress) {
  //     setAuthorizerArgs([userAddress, balancerRelayer, true])
  //   }
  // }, [userAddress])

  function handleOnClick() {
    if (!willTxFail) {
      setRelayerApproval?.()
    }
  }

  // <Box margin={2} padding={2}>{txStatus.isLoading ? 'txStatus loading' : 'txStatus not loading'}</Box>
  // <Box margin={2} padding={2}>txStatus {JSON.stringify(txStatus)}</Box>

  return (
    <Flex direction={{ base: 'column' }}>
      <Box margin={2} padding={2}>
        {setRelayerApprovalError
          ? setRelayerApprovalError.message.substring(0, 80) + '...'
          : 'Todo bien con setAutorizer'}
      </Box>
      <Box margin={2} padding={2}>
        hash {setRelayerApprovalResult?.hash}
      </Box>
      <Box margin={2} padding={2}>
        simulation {willTxFail ? 'TX WILL FAIL' : 'TX WILL PASS'}
      </Box>
      <Box margin={2} padding={2}>
        error {error?.message}
      </Box>
      <Box margin={2} padding={2}>
        <Button disabled={!setRelayerApproval} onClick={handleOnClick}>
          Example Four
        </Button>
      </Box>
    </Flex>
  )
}
