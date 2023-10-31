'use client'

import TransactionFlow from '@/components/btns/transaction-steps/TransactionFlow'
import { poolId, wETHAddress } from '@/lib/debug-helpers'
import { useConstructNativeAssetJoinStep } from '@/lib/modules/steps/join/useConstructNativeAssetJoinStep'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Flex, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useBalance } from 'wagmi'
import { FetchBalanceResult } from 'wagmi/dist/actions'
import RecentTransactions from '../RecentTransactions'

export function NativeAssetJoin() {
  const { step: joinStep } = useConstructNativeAssetJoinStep(poolId)

  const { address } = useUserAccount()

  const [wstETHBalance, setWstETHBalance] = useState<FetchBalanceResult | null>(null)
  const { data } = useBalance({ address, token: wETHAddress })

  useEffect(() => {
    if (data) setWstETHBalance(data)
  }, [data])

  function handleJoinCompleted() {
    console.log('Native asset join completed')
  }

  return (
    <VStack width="full">
      <RecentTransactions />

      <Flex>
        <TransactionFlow
          completedAlertContent="Successfully joined pool with ETH"
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={[joinStep]}
        />
        {/* <Button onClick={() => joinQuery.refetch()}>Refetch</Button> */}
      </Flex>

      <Flex>WETH User Balance: {wstETHBalance ? `${wstETHBalance.formatted}` : '-'}</Flex>
    </VStack>
  )
}
