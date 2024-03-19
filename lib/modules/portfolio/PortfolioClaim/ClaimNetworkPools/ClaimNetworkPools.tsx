import { Flex, Heading, Stack } from '@chakra-ui/react'
import { usePortfolio } from '../../usePortfolio'
import { ClaimNetworkBlock } from './ClaimNetworkBlock'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { chainToSlugMap } from '../../../pool/pool.utils'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

export function ClaimNetworkPools() {
  const { poolsByChainMap, protocolRewardsBalance, totalFiatClaimableBalanceByChain } =
    usePortfolio()

  const { isConnected } = useUserAccount()

  const emptyChainMap = Object.keys(poolsByChainMap).length === 0

  if (!isConnected || emptyChainMap) {
    return null
  }

  return (
    <Stack gap={5}>
      <Heading size="lg">Claimable incentives</Heading>

      <Flex flexDirection={['column', 'column', 'column', 'row']} gap={6} flexWrap="wrap">
        {Object.entries(poolsByChainMap).map(([chain, pools]) => (
          <ClaimNetworkBlock
            key={chain}
            chain={pools[0].chain}
            networkTotalClaimableFiatBalance={totalFiatClaimableBalanceByChain[
              pools[0].chain
            ].toNumber()}
            link={`/portfolio/${chainToSlugMap[pools[0].chain]}`}
          />
        ))}

        {Number(protocolRewardsBalance) > 0 && (
          <ClaimNetworkBlock
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
