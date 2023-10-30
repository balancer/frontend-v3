'use client'

import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { useConstructJoinPoolStep } from '@/lib/modules/steps/join/useConstructJoinPoolStep'
import { useConstructApproveTokenStep } from '@/lib/modules/steps/useConstructApproveTokenStep'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Flex, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useBalance } from 'wagmi'
import { FetchBalanceResult } from 'wagmi/dist/actions'

export function Approval() {
  const poolId = '0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512' // Balancer Weighted wjAura and WETH
  const wETHAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  const { step: tokenApprovalStep } = useConstructApproveTokenStep(wETHAddress)
  const { step: joinStep } = useConstructJoinPoolStep(poolId)

  const { address } = useUserAccount()

  const [wstETHBalance, setWstETHBalance] = useState<FetchBalanceResult | null>(null)
  const { data } = useBalance({ address, token: wETHAddress })

  useEffect(() => {
    if (data) setWstETHBalance(data)
  }, [data])

  function handleJoinCompleted() {
    console.log('Join completed')
  }

  return (
    <VStack width="full">
      <Flex>
        <TransactionFlow
          completedAlertContent="Successfully joined pool"
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={[tokenApprovalStep, joinStep]}
        />
        {/* <Button onClick={() => joinQuery.refetch()}>Refetch</Button> */}
      </Flex>

      <Flex>wsETH User Balance: {wstETHBalance ? `${wstETHBalance.formatted}` : '-'}</Flex>
    </VStack>
  )
}
