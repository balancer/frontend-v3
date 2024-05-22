import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { TokenRowGroup } from '@/lib/modules/tokens/TokenRow/TokenRowGroup'
import { VStack, Card } from '@chakra-ui/react'
import { Address } from 'viem'
import { usePool } from '../../usePool'
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'
import { useUnstake } from './UnstakeProvider'

type Props = {
  stakedBalance: string
  stakedBalanceUsd: string
  rewardAmounts: HumanTokenAmountWithAddress[]
  totalClaimableUsd: string
}

export function UnstakePreview({
  stakedBalance,
  stakedBalanceUsd,
  rewardAmounts,
  totalClaimableUsd,
}: Props) {
  const { pool } = usePool()
  const { unstakeTxHash } = useUnstake()

  return (
    <VStack spacing="sm" w="full">
      <Card variant="subSection">
        <TokenRow
          label={unstakeTxHash ? 'Unstaked LP tokens' : 'Staked LP tokens'}
          address={pool.address as Address}
          value={stakedBalance}
          usdValue={stakedBalanceUsd}
          chain={pool.chain}
          pool={pool}
          isBpt
        />
      </Card>
      <Card variant="subSection">
        <TokenRowGroup
          label={unstakeTxHash ? 'Claimed rewards' : 'Claimable rewards'}
          amounts={rewardAmounts}
          totalUSDValue={totalClaimableUsd}
          chain={pool.chain}
        />
      </Card>
    </VStack>
  )
}
