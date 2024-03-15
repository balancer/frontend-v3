'use client'

import { ClaimPoolLayout } from '@/lib/modules/portfolio/PortfolioClaim/ClaimPoolLayout'
import { ClaimTotal } from '@/lib/modules/portfolio/PortfolioClaim/ClaimTotal'
import { ClaimAllVebalRewardsButton } from '@/lib/modules/portfolio/PortfolioClaim/ClaimButtons/ClaimAllVebalRewardsButton'
import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Card, Text } from '@chakra-ui/react'
import { Hex } from 'viem'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

export default function BalancerProtocolRevenue() {
  const { protocolRewardsData, protocolRewardsBalance } = usePortfolio()
  const { toCurrency } = useCurrency()

  return (
    <ClaimPoolLayout backLink={'/portfolio'} gap={4} title="Balancer protocol revenue">
      <Card variant="level4" gap={4} p="md" shadow="xl" flex="1" width="100%">
        <Text fontWeight="700">You`ll get</Text>
        {protocolRewardsData?.map((reward, idx) => (
          <TokenRow
            key={idx}
            address={reward.tokenAddress as Hex}
            value={reward.formattedBalance}
            chain={GqlChain.Mainnet}
          />
        ))}
      </Card>

      <ClaimTotal total={toCurrency(protocolRewardsBalance)} />

      <ClaimAllVebalRewardsButton />
    </ClaimPoolLayout>
  )
}
