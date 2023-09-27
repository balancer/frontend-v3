'use client'

import { noUserAddress } from '@/lib/contracts/wagmi-helpers'
import { Box, Button, VStack } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { TransactionState } from './TransactionState'

import { useManagedTransaction } from '@/lib/contracts/contract'
import { useOnNewTxHash } from '@/lib/contracts/useOnNewTxHash'

export function WriteContractExample() {
  const balancerRelayer = '0xfeA793Aa415061C483D2390414275AD314B3F621'
  const { address: userAddress } = useAccount()

  // These args can be dynamic (i.e. from html input)
  const approvalArgs = [userAddress || noUserAddress, balancerRelayer, true] as const

  const isEnabled = !!userAddress
  const txInfo = useManagedTransaction(
    'balancer.vaultV2',
    'setRelayerApproval',
    {
      args: approvalArgs,
    },
    {
      enabled: isEnabled,
      onSuccess: () => {
        console.log('Test on success hook.')
      },
    }
  )

  const { simulation, execution } = txInfo

  const { data: setRelayerApprovalResult } = execution

  useOnNewTxHash(txInfo)

  function handleOnClick() {
    if (!simulation.isError) {
      execution.write?.()
    }
  }

  function buttonLabel() {
    if (simulation.isLoading || execution.isLoading) return 'Loading'
    return 'Approve Relayer'
  }

  return (
    <VStack>
      {setRelayerApprovalResult?.hash && (
        <TransactionState hash={setRelayerApprovalResult.hash}></TransactionState>
      )}
      <Box margin={2} padding={2}>
        {!execution.isSuccess && (
          <Button
            isDisabled={!execution.write}
            isLoading={execution.isLoading}
            onClick={handleOnClick}
          >
            {buttonLabel()}
          </Button>
        )}
        {execution.isSuccess && <Button onClick={execution.reset}>Try again</Button>}
      </Box>
    </VStack>
  )
}
