'use client'

import { ClaimReviewLayout } from '@/lib/modules/portfolio/PortfolioClaim/ClaimReviewLayout'
import { ClaimReviewTotal } from '@/lib/modules/portfolio/PortfolioClaim/ClaimReviewTotal'
import { ClaimAllVebalRewardsButton } from '@/lib/modules/portfolio/PortfolioClaim/ClaimButtons/ClaimAllVebalRewardsButton'
import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Card, Text } from '@chakra-ui/react'
import { Hex } from 'viem'

export default function BalancerProtocolRevenue() {
  const { protocolRewardsData } = usePortfolio()

  return (
    <ClaimReviewLayout backLink={'/portfolio'} gap={4} title="Balancer protocol revenue">
      <Card variant="level4" gap={4} p="md" shadow="xl" flex="1" width="100%">
        <Text>You`ll get</Text>
        {protocolRewardsData?.map((reward, idx) => (
          <TokenRow
            key={idx}
            address={reward.tokenAddress as Hex}
            value={reward.formattedBalance}
            chain={GqlChain.Mainnet}
          />
        ))}
      </Card>

      <ClaimReviewTotal total={'123'} />

      <ClaimAllVebalRewardsButton />
    </ClaimReviewLayout>
  )
}
