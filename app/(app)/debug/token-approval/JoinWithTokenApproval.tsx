/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
'use client'

import { poolId, vaultV2Address, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { useConstructJoinPoolStep } from '@/lib/modules/steps/join/useConstructJoinPoolStep'
import { useConstructApproveTokenStep } from '@/lib/modules/steps/useConstructApproveTokenStep'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useUserTokenAllowance } from '@/lib/modules/web3/useUserTokenAllowance'
import { Flex, Heading, InputGroup, InputLeftAddon, Stack, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useBalance } from 'wagmi'
import { FetchBalanceResult } from 'wagmi/dist/actions'
import RecentTransactions from '../RecentTransactions'

import { Input } from '@chakra-ui/react'
import { HumanAmount } from '@balancer/sdk'
import { useDebounce } from '@/lib/shared/hooks/useDebounce'

export function JoinWithTokenApproval() {
  const { step: tokenApprovalStep } = useConstructApproveTokenStep(wETHAddress)
  const { step: tokenApprovalStep2 } = useConstructApproveTokenStep(wjAuraAddress)
  const { step: joinStep, setWethHumanAmount } = useConstructJoinPoolStep(poolId)
  const steps = [tokenApprovalStep, tokenApprovalStep2, joinStep]

  const { address } = useUserAccount()

  const [wethBalance, setWethBalance] = useState<FetchBalanceResult | null>(null)
  const [wjAURABalance, setWjAURABalance] = useState<FetchBalanceResult | null>(null)
  const { data: wethBalanceData } = useBalance({ address, token: wETHAddress })
  const { data: wjAURABalanceData } = useBalance({ address, token: wjAuraAddress })
  const { allowance, refetch: refetchTokenAllowance } = useUserTokenAllowance(
    wETHAddress,
    vaultV2Address
  )
  const { allowance: allowance2, refetch: refetchTokenAllowance2 } = useUserTokenAllowance(
    wjAuraAddress,
    vaultV2Address
  )

  useEffect(() => {
    if (wethBalanceData) setWethBalance(wethBalanceData)
  }, [wethBalanceData])
  useEffect(() => {
    if (wjAURABalanceData) setWjAURABalance(wjAURABalanceData)
  }, [JSON.stringify(wjAURABalanceData)])

  // Do we export this hook as part of flow step?
  useEffect(() => {
    if (tokenApprovalStep.execution.isSuccess) refetchTokenAllowance()
  }, [tokenApprovalStep.execution.isSuccess])
  useEffect(() => {
    if (tokenApprovalStep2.execution.isSuccess) refetchTokenAllowance2()
  }, [tokenApprovalStep2.execution.isSuccess])

  function handleJoinCompleted() {
    console.log('Join completed')
  }

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWethHumanAmount(event.target.value as HumanAmount)
  }

  const debouncedChangeHandler = useDebounce(changeHandler, 300)

  return (
    <VStack width="full">
      <RecentTransactions />

      <Flex height="10"></Flex>

      <Stack spacing={3}>
        <InputGroup>
          <InputLeftAddon children="WETH amount" />
          <Input
            type="text"
            placeholder="WETH amount"
            value={1}
            onChange={debouncedChangeHandler}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon children="wjAura amount" />
          <Input type="text" placeholder="wjAura amount" disabled value={1} />
        </InputGroup>
      </Stack>

      <Flex height="10"></Flex>

      <Flex>
        <TransactionFlow
          completedAlertContent="Successfully joined pool"
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={steps}
        />
      </Flex>

      <VStack background="gray.100" p="4" rounded="md" mt="xl">
        <Heading size="sm">Debug Data</Heading>
        <Flex>WETH Balance: {wethBalance ? `${wethBalance.formatted}` : '-'}</Flex>
        <Flex>wjAURA Balance: {wjAURABalance ? `${wjAURABalance.formatted}` : '-'}</Flex>
        <Flex>WETH Allowance: {allowance >= 0 ? `${allowance}` : '-'}</Flex>
        <Flex>wjAURA Allowance: {allowance2 >= 0 ? `${allowance2}` : '-'}</Flex>
      </VStack>
    </VStack>
  )
}
