'use client'
import { Flex, Heading, Stack } from '@chakra-ui/react'
import { usePortfolio } from '../../PortfolioProvider'
import { ClaimNetworkBlock } from './ClaimNetworkBlock'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { chainToSlugMap } from '../../../pool/pool.utils'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { useState } from 'react'
import ClaimProtocolRevenueModal from '../ClaimProtocolRevenueModal'
import { useRouter } from 'next/navigation'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { useHasMerklRewards } from '../../merkl/useHasMerklRewards'
import { MerklAlert } from '../../merkl/MerklAlert'

export function ClaimNetworkPools() {
  const {
    poolsByChainMap,
    protocolRewardsBalance,
    totalFiatClaimableBalanceByChain,
    poolsWithOnchainUserBalances,
  } = usePortfolio()

  const [isOpenedProtocolRevenueModal, setIsOpenedProtocolRevenueModal] = useState(false)
  const { isConnected } = useUserAccount()
  const router = useRouter()

  const emptyChainMap = Object.keys(poolsByChainMap).length === 0
  const hasProtocolRewards = protocolRewardsBalance && protocolRewardsBalance.isGreaterThan(0)

  const { hasMerklRewards } = useHasMerklRewards(poolsWithOnchainUserBalances)

  if (!isConnected || (emptyChainMap && !hasProtocolRewards)) {
    return null
  }

  return (
    <FadeInOnView>
      <Stack gap={5}>
        <Heading size="lg">Claimable incentives</Heading>

        <Flex flexDirection={['column', 'column', 'column', 'row']} gap={6} flexWrap="wrap">
          {hasMerklRewards && <MerklAlert />}

          {Object.entries(poolsByChainMap).map(([chain, pools]) => (
            <ClaimNetworkBlock
              key={chain}
              chain={pools[0].chain}
              networkTotalClaimableFiatBalance={totalFiatClaimableBalanceByChain[
                pools[0].chain
              ].toNumber()}
              onClick={() => router.push(`/portfolio/${chainToSlugMap[pools[0].chain]}`)}
            />
          ))}

          {hasProtocolRewards && (
            <ClaimNetworkBlock
              chain={GqlChain.Mainnet}
              networkTotalClaimableFiatBalance={protocolRewardsBalance.toNumber()}
              title="Balancer protocol revenue"
              onClick={() => setIsOpenedProtocolRevenueModal(true)}
            />
          )}
        </Flex>

        <ClaimProtocolRevenueModal
          isOpen={isOpenedProtocolRevenueModal}
          onClose={() => setIsOpenedProtocolRevenueModal(false)}
        />
      </Stack>
    </FadeInOnView>
  )
}
