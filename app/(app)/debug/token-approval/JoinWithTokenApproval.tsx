/* eslint-disable react/no-children-prop */
'use client'

import { poolId, vaultV2Address, wETHAddress } from '@/lib/debug-helpers'
import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { useConstructJoinPoolStep } from '@/lib/modules/steps/join/useConstructJoinPoolStep'
import { useConstructApproveTokenStep } from '@/lib/modules/steps/useConstructApproveTokenStep'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useUserTokenAllowance } from '@/lib/modules/web3/useUserTokenAllowance'
import { Flex, InputGroup, InputLeftAddon, Stack, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useBalance } from 'wagmi'
import { FetchBalanceResult } from 'wagmi/dist/actions'
import RecentTransactions from '../RecentTransactions'

import { Input } from '@chakra-ui/react'
import { HumanAmount } from '@balancer/sdk'
import { useDebounce } from '@/lib/shared/hooks/useDebounce'

export function JoinWithTokenApproval() {
  const { step: tokenApprovalStep } = useConstructApproveTokenStep(wETHAddress)
  const { step: joinStep, setWethHumanAmount } = useConstructJoinPoolStep(poolId)

  const { address } = useUserAccount()

  const [wethBalance, setWethBalance] = useState<FetchBalanceResult | null>(null)
  const { data } = useBalance({ address, token: wETHAddress })
  const { allowance } = useUserTokenAllowance(wETHAddress, vaultV2Address)

  useEffect(() => {
    if (data) setWethBalance(data)
  }, [data])

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
          <Input type="text" placeholder="WETH amount" onChange={debouncedChangeHandler} />
        </InputGroup>
      </Stack>

      <Flex height="10"></Flex>

      <Flex>
        <TransactionFlow
          completedAlertContent="Successfully joined pool"
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={[joinStep]}
        />
        {/* <Button onClick={() => joinQuery.refetch()}>Refetch</Button> */}
      </Flex>

      <Flex>WETH Balance: {wethBalance ? `${wethBalance.formatted}` : '-'}</Flex>
      <Flex>WETH Allowance: {allowance >= 0 ? `${allowance}` : '-'}</Flex>
    </VStack>
  )
}
