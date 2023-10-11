'use client'

import { noUserAddress } from '@/lib/contracts/wagmi-helpers'
import { Box, Button, VStack } from '@chakra-ui/react'
import { Address, useAccount } from 'wagmi'
import { TransactionState } from './TransactionState'

import { useManagedTransaction } from '@/lib/contracts/useManagedTransaction'
import { useState } from 'react'
import { TransactionStep } from '@/lib/contracts/contract.types'

const balancerRelayer = '0xfeA793Aa415061C483D2390414275AD314B3F621'

function useConstructRelayerApprovalTransactionStep(): TransactionStep {
  const { address: userAddress } = useAccount()
  const [approvalArgs] = useState<[Address, Address, boolean]>([
    userAddress || noUserAddress,
    balancerRelayer,
    true,
  ])
  const { execution, simulation, result } = useManagedTransaction(
    'balancer.vaultV2',
    'setRelayerApproval',
    { args: approvalArgs },
    {
      enabled: !!userAddress,
      onSuccess: () => {
        console.log('Test on success hook.')
      },
    }
  )

  function getButtonLabel(): string {
    if (simulation.isLoading || execution.isLoading) {
      return 'Loading'
    }
    return 'Approve Relayer'
  }

  return {
    execution,
    simulation,
    getButtonLabel,
    result,
    id: 'relayer-approval',
  }
}

export function WriteContractExample() {
  // These args can be dynamic (i.e. from html input)
  // const [approvalArgs, setApprovalArgs] = useState<[Address, Address, boolean]>([userAddress || noUserAddress, balancerRelayer, true]);
  const {
    execution,
    simulation,
    getButtonLabel: getRelayerApprovalButtonLabel,
    result: approvalResult,
  } = useConstructRelayerApprovalTransactionStep()

  function handleOnClick() {
    if (!simulation.isError) {
      execution.write?.()
    }
  }

  return (
    <VStack>
      {execution.data?.hash && <TransactionState result={approvalResult}></TransactionState>}
      <Box margin={2} padding={2}>
        {!execution.isSuccess && (
          <Button
            isDisabled={!execution.write}
            isLoading={execution.isLoading}
            onClick={handleOnClick}
          >
            {getRelayerApprovalButtonLabel()}
          </Button>
        )}
        {execution.isSuccess && <Button onClick={execution.reset}>Try again</Button>}
      </Box>
    </VStack>
  )
}
