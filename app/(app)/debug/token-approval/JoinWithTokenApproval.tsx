'use client'

import { poolId, vaultV2Address, wETHAddress } from '@/lib/debug-helpers'
import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { useConstructJoinPoolStep } from '@/lib/modules/steps/join/useConstructJoinPoolStep'
import { useConstructApproveTokenStep } from '@/lib/modules/steps/useConstructApproveTokenStep'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useUserTokenAllowance } from '@/lib/modules/web3/useUserTokenAllowance'
import { Flex, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useBalance } from 'wagmi'
import { FetchBalanceResult } from 'wagmi/actions'
import RecentTransactions from '../RecentTransactions'

export function JoinWithTokenApproval() {
  const { step: tokenApprovalStep } = useConstructApproveTokenStep(wETHAddress)
  const { step: joinStep } = useConstructJoinPoolStep(poolId)

  const { address } = useUserAccount()

  const [wstETHBalance, setWstETHBalance] = useState<FetchBalanceResult | null>(null)
  const { data } = useBalance({ address, token: wETHAddress })
  const { allowance } = useUserTokenAllowance(wETHAddress, vaultV2Address)

  useEffect(() => {
    if (data) setWstETHBalance(data)
  }, [data])

  function handleJoinCompleted() {
    console.log('Join completed')
  }

  return (
    <VStack width="full">
      <RecentTransactions />

      <Flex>
        <TransactionFlow
          completedAlertContent="Successfully joined pool"
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={[tokenApprovalStep, joinStep]}
        />
        {/* <Button onClick={() => joinQuery.refetch()}>Refetch</Button> */}
      </Flex>

      <Flex>WETH Balance: {wstETHBalance ? `${wstETHBalance.formatted}` : '-'}</Flex>
      <Flex>WETH Allowance: {allowance >= 0 ? `${allowance}` : '-'}</Flex>
    </VStack>
  )
}
