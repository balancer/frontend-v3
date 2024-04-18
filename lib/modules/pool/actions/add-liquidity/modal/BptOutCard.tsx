import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Card, HStack, Skeleton, Text, VStack } from '@chakra-ui/react'
import { Address, Hash, formatUnits } from 'viem'
import { usePool } from '../../../usePool'
import { useAddLiquidity } from '../useAddLiquidity'
// eslint-disable-next-line max-len
import { useAddLiquidityReceipt } from '@/app/(app)/pools/[chain]/[variant]/[id]/add-liquidity/[hash]/useTransactionLogsQuery'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { BPT_DECIMALS } from '../../../pool.constants'
import { useReceipt } from '../../../../transactions/transaction-steps/useReceipt'

export function BptOutCardFromReceipt() {
  const { isLoading: isLoadingUserAccount, userAddress } = useUserAccount()
  const { txHash } = useReceipt()

  const { isLoading, error, receivedBptUnits } = useAddLiquidityReceipt({
    userAddress,
    txHash: txHash as Hash,
  })

  if (isLoading || isLoadingUserAccount) return <Skeleton height="30px" w="100px" />

  if (!userAddress) return <Text>User is not connected</Text>
  if (error) return <Text>We were unable to find this TxnHash</Text>

  return <BptOutCard bptOutUnits={receivedBptUnits} type="receipt" />
}

export function BptOutCardFromQuote() {
  const { simulationQuery } = useAddLiquidity()
  const bptOut = simulationQuery?.data?.bptOut
  const bptOutUnits = bptOut ? formatUnits(bptOut.amount, BPT_DECIMALS) : '0'

  return <BptOutCard bptOutUnits={bptOutUnits} type="quote" />
}

type Props = {
  bptOutUnits: string
  type: 'quote' | 'receipt'
}
function BptOutCard({ bptOutUnits, type }: Props) {
  const { pool } = usePool()

  const isQuote = type === 'quote'

  return (
    <Card variant="modalSubSection">
      <VStack align="start" spacing="md">
        <HStack justify="space-between" w="full">
          <Text color="grayText">{isQuote ? "You'll get (if no slippage)" : 'You got'}</Text>
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
    </Card>
  )
}
