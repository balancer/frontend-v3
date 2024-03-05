import { Flex, HStack, Heading, Stack } from '@chakra-ui/react'
import { usePortfolio } from '../usePortfolio'
import { NetworkClaimBlock } from './NetworkClaimBlock'

export function PortfolioNetworkClaim() {
  const { poolsByChainMap } = usePortfolio()

  function openClaimModal(chain: string) {
    console.log(chain)
  }
  return (
    <Stack>
      <Heading size="lg">Claimable incentives</Heading>
      <Flex flexDirection={['column', 'column', 'column', 'row']} gap={6}>
        {Object.entries(poolsByChainMap).map(([chain, pools]) => (
          <NetworkClaimBlock
            key={chain}
            chain={pools[0].chain}
            openClaimModal={openClaimModal}
            networkTotalClaimableFiatBalance={1000}
          />
        ))}
      </Flex>
    </Stack>
  )
}
