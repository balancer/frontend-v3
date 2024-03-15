import { Flex, Heading, Stack } from '@chakra-ui/react'
import { usePortfolio } from '../../usePortfolio'
import { NetworkClaimBlock } from './NetworkClaimBlock'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { chainToSlugMap } from '../../../pool/pool.utils'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

export function PortfolioNetworkClaim() {
  const { poolsByChainMap, protocolRewardsBalance, totalFiatClaimableBalanceByChain } =
    usePortfolio()
  const { isConnected } = useUserAccount()

  if (!isConnected) {
    return null
  }

  return (
    <Stack gap={5}>
      <Heading size="lg">Claimable incentives</Heading>

      <Flex flexDirection={['column', 'column', 'column', 'row']} gap={6} flexWrap="wrap">
        {Object.entries(poolsByChainMap).map(([chain, pools]) => (
          <NetworkClaimBlock
            key={chain}
            chain={pools[0].chain}
            networkTotalClaimableFiatBalance={totalFiatClaimableBalanceByChain[
              pools[0].chain
            ].toNumber()}
            link={`/portfolio/${chainToSlugMap[pools[0].chain]}`}
          />
        ))}

        {Number(protocolRewardsBalance) > 0 && (
          <NetworkClaimBlock
            chain={GqlChain.Mainnet}
            networkTotalClaimableFiatBalance={protocolRewardsBalance.toNumber()}
            title="Balancer protocol revenue"
            link="/portfolio/balancer-protocol-revenue"
          />
        )}
      </Flex>
    </Stack>
  )
}
