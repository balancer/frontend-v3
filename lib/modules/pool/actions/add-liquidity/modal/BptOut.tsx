import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { HStack, Text, VStack } from '@chakra-ui/react'
import { Address, formatUnits } from 'viem'
import { BPT_DECIMALS } from '../../../pool.constants'
import { Pool, usePool } from '../../../usePool'
import { useAddLiquidity } from '../useAddLiquidity'
import { bn } from '@/lib/shared/utils/numbers'

export function BptRow({
  label,
  rightLabel,
  bptAmount,
  pool,
}: {
  label: string
  rightLabel?: string
  bptAmount: string
  pool: Pool
}) {
  return (
    <VStack align="start" spacing="md">
      <HStack justify="space-between" w="full">
        <Text color="grayText">{label}</Text>
        {rightLabel && <Text color="grayText">{rightLabel}</Text>}
      </HStack>
      <TokenRow
        value={bptAmount}
        address={pool.address as Address}
        chain={pool.chain}
        abbreviated={false}
        isBpt={true}
        pool={pool}
      />
    </VStack>
  )
}

export function ReceiptBptOut({ actualBptOut }: { actualBptOut: string }) {
  const { pool } = usePool()
  const { simulationQuery } = useAddLiquidity()
  const expectedBptOutInt = simulationQuery?.data?.bptOut
  const expectedBptOut = expectedBptOutInt
    ? formatUnits(expectedBptOutInt.amount, BPT_DECIMALS)
    : '0'

  const bptDiff = bn(actualBptOut).minus(expectedBptOut)

  const diffLabel = !bptDiff.isZero()
    ? bptDiff.isNegative()
      ? `-${bptDiff.abs().toString()} on quote`
      : `+${bptDiff.abs().toString()} on quote`
    : 'No slippage'

  return <BptRow label="You got" rightLabel={diffLabel} bptAmount={actualBptOut} pool={pool} />
}

export function QuoteBptOut({ label }: { label?: string }) {
  const { simulationQuery } = useAddLiquidity()
  const bptOut = simulationQuery?.data?.bptOut
  const bptOutUnits = bptOut ? formatUnits(bptOut.amount, BPT_DECIMALS) : '0'
  const { pool } = usePool()

  return (
    <BptRow label={label ?? 'You will get (if no slippage)'} bptAmount={bptOutUnits} pool={pool} />
  )
}
