import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { HStack, Text, VStack } from '@chakra-ui/react'
import { Address, formatUnits } from 'viem'
import { BPT_DECIMALS } from '../../../pool.constants'
import { usePool } from '../../../usePool'
import { useAddLiquidity } from '../useAddLiquidity'

export function ReceiptBptOut({ receivedBptUnits }: { receivedBptUnits: string }) {
  const { pool } = usePool()

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
