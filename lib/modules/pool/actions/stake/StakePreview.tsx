import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { WalletIcon } from '@/lib/shared/components/icons/WalletIcon'
import { VStack, Card, HStack, Text } from '@chakra-ui/react'
import { Address } from 'viem'
import { usePool } from '../../PoolProvider'
import { HumanAmount } from '@balancer/sdk'
import { useStake } from './StakeProvider'
import StakeAprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/StakeAprTooltip'

export function StakePreview({
  stakableBalance,
  stakableBalanceUsd,
}: {
  stakableBalance: HumanAmount
  stakableBalanceUsd: HumanAmount
}) {
  const { pool, calcPotentialYieldFor } = usePool()
  const { stakeTxHash } = useStake()

  const weeklyYield = calcPotentialYieldFor(stakableBalanceUsd)

  return (
    <VStack spacing="sm" w="full">
      <Card variant="subSection">
        <TokenRow
          label={
            <HStack color="grayText">
              <WalletIcon />
              <Text color="grayText">
                {stakeTxHash ? 'Staked LP tokens' : 'Stakable LP tokens'}
              </Text>
            </HStack>
          }
          address={pool.address as Address}
          value={stakableBalance}
          usdValue={stakableBalanceUsd}
          chain={pool.chain}
          pool={pool}
          isBpt
        />
      </Card>

      <StakeAprTooltip
        data={pool.dynamicData.apr}
        weeklyYield={weeklyYield}
        totalUsdValue={stakableBalanceUsd}
        pool={pool}
      />
    </VStack>
  )
}
