/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { poolId, wETHAddress } from '@/lib/debug-helpers'
import { useConstructNativeAssetJoinStep } from '@/lib/modules/steps/join/useConstructNativeAssetJoinStep'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Flex, Heading, Input, InputGroup, InputLeftAddon, Stack, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useBalance } from 'wagmi'
import { FetchBalanceResult } from 'wagmi/dist/actions'
import RecentTransactions from '../RecentTransactions'
import { useDebounce } from '@/lib/shared/hooks/useDebounce'
import { HumanAmount } from '@balancer/sdk'
import { useConstructApproveTokenStep } from '@/lib/modules/steps/useConstructApproveTokenStep'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'

export function NativeAssetJoin() {
  const { step: tokenApprovalStep } = useConstructApproveTokenStep(wETHAddress)
  const { step: joinStep, setWethHumanAmount } = useConstructNativeAssetJoinStep(poolId)
  const steps = [tokenApprovalStep, joinStep]

  const { address } = useUserAccount()

  const [wethBalance, setWethBalance] = useState<FetchBalanceResult | null>(null)
  const { data } = useBalance({ address, token: wETHAddress })
  const { allowances, refetchAllowances } = useTokenAllowances()
  const allowance = allowances[wETHAddress]

  useEffect(() => {
    if (data) setWethBalance(data)
  }, [data])

  // Do we export this hook as part of flow step?
  useEffect(() => {
    if (tokenApprovalStep.execution.isSuccess) refetchAllowances()
  }, [tokenApprovalStep.execution.isSuccess])

  function handleJoinCompleted() {
    console.log('Native asset join completed')
  }

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWethHumanAmount(event.target.value as HumanAmount)
  }

  const debouncedChangeHandler = useDebounce(changeHandler, 300)

  return (
    <VStack width="full">
      <Heading>Example: Native asset join</Heading>

      <RecentTransactions />

      <Flex height="10"></Flex>

      <Stack spacing={3}>
        <InputGroup>
          <InputLeftAddon>ETH amount</InputLeftAddon>
          <Input type="text" placeholder="ETH amount" onChange={debouncedChangeHandler} />
        </InputGroup>
      </Stack>

      <Flex>
        <TransactionFlow
          completedAlertContent="Successfully joined pool with ETH"
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={steps}
        />
      </Flex>

      <VStack background="gray.100" p="4" rounded="md" mt="xl">
        <Heading size="sm">Debug Data</Heading>
        <Flex>WETH Balance: {wethBalance ? `${wethBalance.formatted}` : '-'}</Flex>
        <Flex>WETH Allowance: {allowance >= 0 ? `${allowance}` : '-'}</Flex>
      </VStack>
    </VStack>
  )
}
