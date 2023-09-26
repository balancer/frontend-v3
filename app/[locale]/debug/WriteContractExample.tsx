'use client'

import { noUserAddress } from '@/lib/contracts/wagmi-helpers'
import { Box, Button, VStack } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { TransactionState } from './TransactionState'

import { ABIS } from '@/lib/contracts/ABIS'
import { useOnNewTxHash } from '@/lib/contracts/useOnNewTxHash'
import { useWriteContractConfig } from '@/lib/contracts/useWriteContractConfig'
import { useWriteContractWithSimulation } from '@/lib/contracts/useWriteContractWithSimulation'

export function WriteContractExample() {
  const balancerRelayer = '0xfeA793Aa415061C483D2390414275AD314B3F621'
  const { address: userAddress } = useAccount()

  // These args can be dynamic (i.e. from html input)
  const approvalArgs = [userAddress || noUserAddress, balancerRelayer, true] as const

  const contractConfig = useWriteContractConfig({
    abi: ABIS.vaultV2,
    functionName: 'setRelayerApproval',
    args: approvalArgs,
  })

  const isEnabled = !!userAddress

  const txInfo = useWriteContractWithSimulation(contractConfig as any, isEnabled)

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
