import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { WalletIcon } from '@/lib/shared/components/icons/WalletIcon'
import { VStack, Card, HStack, Text, Icon } from '@chakra-ui/react'
import { Address } from 'viem'
import { usePool } from '../../PoolProvider'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { HumanAmount } from '@balancer/sdk'
import { useStake } from './StakeProvider'

export function StakePreview({
  stakableBalance,
  stakableBalanceUsd,
}: {
  stakableBalance: HumanAmount
  stakableBalanceUsd: HumanAmount
}) {
  const { pool, calcPotentialYieldFor } = usePool()
  const { toCurrency } = useCurrency()
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

      <Card variant="subSection">
        <VStack align="start" w="full" spacing="sm">
          <Text>Potential yield (1w)</Text>
          <HStack>
            <Text variant="special" fontSize="lg" fontWeight="bold">
              {weeklyYield ? toCurrency(weeklyYield, { abbreviated: false }) : '-'}
            </Text>
            <Icon as={StarsIcon} />
          </HStack>
        </VStack>
      </Card>
    </VStack>
  )
}
