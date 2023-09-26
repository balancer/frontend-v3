'use client'

import { noUserAddress } from '@/lib/contracts/wagmi-helpers'
import { Box, Button, VStack } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { TransactionState } from './TransactionState'

import { useManagedTransaction } from '@/lib/contracts/contract'
import { useOnNewTxHash } from '@/lib/contracts/useOnNewTxHash'
import { ErrorAlert } from './ErrorAlert'
import { ReactNode } from 'react'

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
    isEnabled
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

  function formatError() {
    if (simulation.error) return formatErrorMsg(simulation.error)
    if (execution.error) return formatErrorMsg(execution.error)
    return ''
  }

  function WagmiError(): ReactNode {
    if (simulation.isError || execution.isError)
      return <ErrorAlert errorMessage={formatError()}></ErrorAlert>
    return <></>
  }

  function formatErrorMsg(error: Error): string {
    console.log(error.message)
    return error.message as string
  }

  function FOO(): string {
    return execution.isError ? '' : ''
  }

  return (
    <VStack>
      <Box>
        {setRelayerApprovalResult?.hash && (
          <TransactionState hash={setRelayerApprovalResult.hash}></TransactionState>
        )}
        {WagmiError()}
        {FOO()}
      </Box>
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
