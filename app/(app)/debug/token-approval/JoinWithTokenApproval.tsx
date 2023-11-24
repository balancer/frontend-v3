/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
'use client'

import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { useConstructJoinPoolStep } from '@/lib/modules/steps/join/useConstructJoinPoolStep'
import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { Flex, Heading, InputGroup, InputLeftAddon, Stack, VStack } from '@chakra-ui/react'
import RecentTransactions from '../RecentTransactions'

import { AmountToApprove } from '@/lib/modules/pool/join/approvals'
import { useConstructTokenApprovals } from '@/lib/modules/pool/join/useTokenApprovals'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { usePoolStateInput } from '@/lib/shared/hooks/balancer-api/usePoolStateInput'
import { useDebounce } from '@/lib/shared/hooks/useDebounce'
import { HumanAmount } from '@balancer/sdk'
import { Input } from '@chakra-ui/react'

export function JoinWithTokenApproval() {
  const poolStateQuery = usePoolStateInput(poolId)
  const { allowances } = useTokenAllowances()

  //This would come from the user form --> MAKE FORM DYNAMIC FROM THE given pool tokens
  const amountsToApprove: AmountToApprove[] = [
    { amount: 10000000n, tokenAddress: wETHAddress },
    { tokenAddress: wjAuraAddress, amount: 10000000n },
  ]

  const { tokenApprovalSteps } = useConstructTokenApprovals(amountsToApprove)
  const { step: joinStep, setWethHumanAmount } = useConstructJoinPoolStep(poolStateQuery)
  const steps = [...tokenApprovalSteps, joinStep]

  const { balanceFor, isBalancesLoading } = useTokenBalances()

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
        <Flex>
          WETH Balance: {!isBalancesLoading ? `${balanceFor(wETHAddress)?.formatted}` : '-'}
        </Flex>
        <Flex>
          wjAURA Balance: {!isBalancesLoading ? `${balanceFor(wjAuraAddress)?.formatted}` : '-'}
        </Flex>
        <Flex>
          WETH Allowance: {allowances[wETHAddress] >= 0 ? `${allowances[wETHAddress]}` : '-'}
        </Flex>
        <Flex>
          wjAURA Allowance: {allowances[wjAuraAddress] >= 0 ? `${allowances[wjAuraAddress]}` : '-'}
        </Flex>
        <Flex>Allowances: {JSON.stringify(allowances)}</Flex>
      </VStack>
    </VStack>
  )
}
