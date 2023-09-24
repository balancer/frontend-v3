'use client'

import { Box, Button, Flex } from '@chakra-ui/react'
import { Address, EncodeFunctionDataParameters } from 'viem'
import { useAccount, useWaitForTransaction } from 'wagmi'
import { vaultABI } from '../abi/generated'
import {
  getHash,
  getHash2,
  useContractConfig,
  useOnNewTxHash,
  useWriteContractWithSimulation,
} from './useGualisWriteContract'
import { useTransactions } from '../modules/web3/TransactionsProvider'
import { TransactionState } from './TransactionState'

export function WriteExampleFive() {
  const balancerRelayer = '0xfeA793Aa415061C483D2390414275AD314B3F621'
  const { address: userAddress, isConnecting, isDisconnected } = useAccount()

  // For testing a simulation error
  // const wrongUserAddress = 'WRONG'

  // TODO: extract to its own file
  const noUserAddress = '0xNoUser' // We use this value to avoid TS inference problems in wagmi hooks

  // TODO: extract to its own file
  const ABIS = {
    vaultV2: vaultABI,
  }

  // These args can be dynamic (i.e. from html input)
  const approvalArgs = [userAddress || noUserAddress, balancerRelayer, true] as const

  const contractConfig = useContractConfig({
    abi: ABIS.vaultV2,
    functionName: 'setRelayerApproval',
    args: approvalArgs,
  })
  // as any //This is safe because the typing is done in useContractConfig
  // as EncodeFunctionDataParameters & { address: Address }
  // TODO: make useContractConfig returning any if we need it

  const isEnabled = !!userAddress
  const { simulation, execution } = useWriteContractWithSimulation(contractConfig as any, isEnabled)

  const { data: setRelayerApprovalResult } = execution

  // confirming (if needed)
  const txStatus = useWaitForTransaction({ hash: getHash2(execution) })

  useOnNewTxHash({ simulation, execution })

  function handleOnClick() {
    if (!simulation.isError) {
      execution.write?.()
    }
  }

  function simulationLoadingLabel() {
    return simulation.isLoading ? 'Simulation loading' : ''
  }
  function simulationOk() {
    return !execution.isError &&
      simulation.isFetched &&
      !simulation.isError &&
      !setRelayerApprovalResult?.hash
      ? 'Simulation OK: you can write 🎉'
      : ''
  }
  function simulationErrorLabel() {
    return simulation.isError ? 'Simulation error' + simulation.error?.message : ''
  }

  function executionErrorLabel() {
    return execution.error
      ? 'Transaction error: ' + execution.error.message.substring(0, 80) + '...'
      : ''
  }

  function txHash() {
    return setRelayerApprovalResult?.hash ? 'TX hash: ' + setRelayerApprovalResult.hash : ''
  }

  // <Box margin={2} padding={2}>{txStatus.isLoading ? 'txStatus loading' : 'txStatus not loading'}</Box>
  // <Box margin={2} padding={2}>txStatus {JSON.stringify(txStatus)}</Box>

  function MaybeTransactionState() {
    if (setRelayerApprovalResult?.hash) {
      return <TransactionState hash={setRelayerApprovalResult.hash}></TransactionState>
    }
  }

  return (
    <Flex direction={{ base: 'column' }}>
      <Box margin={2} padding={2}>
        {simulationOk()}
        {simulationLoadingLabel()}
        {simulationErrorLabel()}
        {executionErrorLabel()}
        {txHash()}
      </Box>
      <MaybeTransactionState></MaybeTransactionState>
      <Box margin={2} padding={2}>
        <Button disabled={!execution.write} onClick={handleOnClick}>
          Example Five
        </Button>
      </Box>
    </Flex>
  )
}
