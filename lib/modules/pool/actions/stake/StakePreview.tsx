import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { WalletIcon } from '@/lib/shared/components/icons/WalletIcon'
import { VStack, Card, HStack, Text, Icon } from '@chakra-ui/react'
import { Address } from 'viem'
import { usePool } from '../../usePool'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'

export function StakePreview() {
  const { pool, calcPotentialYieldFor } = usePool()
  const { toCurrency } = useCurrency()

  const stakableBalance = pool.userBalance?.walletBalance || '0'
  const stakableBalanceUsd = pool.userBalance?.walletBalanceUsd.toString() || '0'

  const weeklyYield = calcPotentialYieldFor(stakableBalanceUsd)

  return (
    <VStack spacing="sm">
      <Card variant="subSection">
        <TokenRow
          label={
            <HStack color="grayText">
              <WalletIcon />
              <Text color="grayText">Stakable LP tokens</Text>
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
