import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Card, Center, Heading } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { Address, parseUnits, parseUnits } from 'viem'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useNextTokenApprovalStep } from '@/lib/modules/tokens/approvals/useNextTokenApprovalStep'
import { BPT_DECIMALS } from '../../pool.constants'
import { HumanAmount } from '@balancer/sdk'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'

export function StakeForm() {
  const { pool } = usePool()
  const { userAddress } = useUserAccount()

  const unstakedBalance = pool.userBalance?.walletBalance || '0'

  const gaugeAddress = pool.staking?.address as Address
  const poolAddress = pool.address as Address

  // Get token allowances
  const tokenAllowances = useTokenAllowances(userAddress, gaugeAddress, [poolAddress])
  // Construct token allowance step
  const amountToApprove = {
    rawAmount: parseUnits(unstakedBalance, BPT_DECIMALS),
    humanAmount: unstakedBalance as HumanAmount,
    tokenAddress: poolAddress,
    tokenSymbol: pool.symbol,
  }
  const { tokenApprovalStep, initialAmountsToApprove } = useNextTokenApprovalStep({
    tokenAllowances,
    amountsToApprove: [amountToApprove],
    actionType: 'Staking',
  })
  // Construct stake step
  const stakeTransaction = useManagedTransaction('')
  // Construct tx steps

  return (
    <Center h="full" w="full" maxW="lg" mx="auto">
      <Card variant="level3" shadow="xl" w="full" p="md">
        <Heading fontWeight="bold" size="h5">
          Stake
        </Heading>
        <Card variant="level0" p="md" shadow="sm" w="full">
          <TokenRow
            address={pool.address as Address}
            value={pool.userBalance?.walletBalance || '0'}
            usdValue={pool.userBalance?.walletBalanceUsd.toString()}
            chain={pool.chain}
          />
        </Card>
      </Card>
    </Center>
  )
}
