/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
'use client'

import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { useConstructAddLiquidityStep } from '@/lib/modules/pool/actions/add-liquidity/useConstructAddLiquidityStep'
import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { Flex, Heading, InputGroup, InputLeftAddon, Stack, VStack } from '@chakra-ui/react'
import RecentTransactions from '../RecentTransactions'

import { AmountToApprove } from '@/lib/modules/tokens/approvals/approval-rules'
import { useNextTokenApprovalStep } from '@/lib/modules/tokens/approvals/useNextTokenApprovalStep'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { usePoolStateInput } from '@/lib/shared/hooks/balancer-api/usePoolStateInput'
import { useDebounce } from '@/lib/shared/hooks/useDebounce'
import { HumanAmount } from '@balancer/sdk'
import { Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { HumanAmountIn } from '@/lib/modules/pool/actions/add-liquidity/add-liquidity.types'

export function JoinWithTokenApproval() {
  const poolStateQuery = usePoolStateInput(poolId)
  const { allowances } = useTokenAllowances()

  //This would come from the user form --> MAKE FORM DYNAMIC FROM THE given pool tokens
  const amountsToApprove: AmountToApprove[] = [
    { tokenAddress: wETHAddress, amount: 10000000n },
    { tokenAddress: wjAuraAddress, amount: 10000000n },
  ]

  const { tokenApprovalStep } = useNextTokenApprovalStep(amountsToApprove)
  const initialWethAmount = '0'
  const [wethHumanAmount, setWethHumanAmount] = useState<HumanAmount>(initialWethAmount)

  const humanAmountsIn: HumanAmountIn[] = [
    { tokenAddress: wETHAddress, humanAmount: wethHumanAmount },
  ]

  const { step: joinStep } = useConstructAddLiquidityStep(poolStateQuery, humanAmountsIn)
  const steps = [tokenApprovalStep, joinStep]

  const { balanceFor, isBalancesLoading } = useTokenBalances()

  function handleJoinCompleted() {
    console.log('Join completed')
  }

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWethHumanAmount(event.target.value as HumanAmount)
  }

  const debouncedChangeHandler = useDebounce(changeHandler, 300)

  // TODO: clean this useEffect
  let wethBalance = balanceFor(wETHAddress)?.formatted
  let wjAuraBalance = balanceFor(wjAuraAddress)?.formatted
  useEffect(() => {
    if (!isBalancesLoading) {
      wethBalance = balanceFor(wETHAddress)?.formatted
      wjAuraBalance = balanceFor(wjAuraAddress)?.formatted
    }
  }, [isBalancesLoading])

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
        <Flex>WETH Balance: {wethBalance ? `${wethBalance}` : '-'}</Flex>
        <Flex>wjAURA Balance: {wjAuraBalance ? `${wjAuraBalance}` : '-'}</Flex>
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
