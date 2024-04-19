import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { useAddLiquidityReceipt } from '@/lib/modules/transactions/transaction-steps/useTransactionLogsQuery'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { HStack, Text, VStack } from '@chakra-ui/react'
import { Address, Hash, formatUnits } from 'viem'
import { useReceipt } from '../../../../transactions/transaction-steps/useReceipt'
import { BPT_DECIMALS } from '../../../pool.constants'
import { usePool } from '../../../usePool'
import { useAddLiquidity } from '../useAddLiquidity'

export function ReceiptBptOut() {
  const { userAddress } = useUserAccount()
  const { txHash } = useReceipt()
  const { pool } = usePool()

  const { receivedBptUnits } = useAddLiquidityReceipt({
    userAddress,
    txHash: txHash as Hash,
  })

  return (
    <VStack align="start" spacing="md">
      <HStack justify="space-between" w="full">
        <Text>You got </Text>
      </HStack>
      <TokenRow
        value={receivedBptUnits}
        address={pool.address as Address}
        chain={pool.chain}
        abbreviated={false}
        isBpt={true}
        pool={pool}
      />
    </VStack>
  )
}

export function QuoteBptOut() {
  const { simulationQuery } = useAddLiquidity()
  const bptOut = simulationQuery?.data?.bptOut
  const bptOutUnits = bptOut ? formatUnits(bptOut.amount, BPT_DECIMALS) : '0'
  const { pool } = usePool()

  return (
    <VStack align="start" spacing="md">
      <HStack justify="space-between" w="full">
        <Text color="grayText">{"You'll get (if no slippage)"}</Text>
      </HStack>
      <TokenRow
        value={bptOutUnits}
        address={pool.address as Address}
        chain={pool.chain}
        abbreviated={false}
        isBpt={true}
        pool={pool}
      />
    </VStack>
  )
}
