/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
'use client'

import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { useConstructAddLiquidityStep } from '@/lib/modules/pool/actions/add-liquidity/useConstructAddLiquidityStep'
import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { Flex, Heading, InputGroup, InputLeftAddon, Stack, VStack } from '@chakra-ui/react'
import RecentTransactions from '../RecentTransactions'

import { AddLiquidityConfigBuilder } from '@/lib/modules/pool/actions/add-liquidity/AddLiquidityConfigBuilder'
import { HumanAmountIn } from '@/lib/modules/pool/actions/add-liquidity/add-liquidity.types'
import { useNextTokenApprovalStep } from '@/lib/modules/tokens/approvals/useNextTokenApprovalStep'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { usePoolStateInput } from '@/lib/shared/hooks/balancer-api/usePoolStateInput'
import { Input } from '@chakra-ui/react'
import { useEffect } from 'react'

type Props = {
  humanAmountsIn: HumanAmountIn[]
  builder: AddLiquidityConfigBuilder
}
export function JoinWithTokenApproval({ humanAmountsIn, builder }: Props) {
  const poolStateQuery = usePoolStateInput(poolId)
  const { allowances } = useTokenAllowances()

  const { tokenApprovalStep } = useNextTokenApprovalStep(
    builder.getAmountsToApprove(humanAmountsIn)
  )

  const { step: joinStep } = useConstructAddLiquidityStep(poolStateQuery, humanAmountsIn, builder)
  const steps = [tokenApprovalStep, joinStep]

  const { balanceFor, isBalancesLoading } = useTokenBalances()

  function handleJoinCompleted() {
    console.log('Join completed')
  }

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
          <Input
            type="text"
            placeholder="WETH amount"
            disabled
            value={humanAmountsIn[0].humanAmount}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon children="wjAura amount" />
          <Input
            type="text"
            placeholder="wjAura amount"
            disabled
            value={humanAmountsIn[1].humanAmount}
          />
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
