'use client'
import { ClaimAllVebalRewardsButton } from '@/lib/modules/portfolio/claim/ClaimAllVebalRewardsButton'
import { StakedPortfolio } from '@/lib/modules/portfolio/StakedPortfolio'
import { UnstakedPortfolio } from '@/lib/modules/portfolio/UnstakedPortfolio'
import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import { Button, HStack, Heading, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { ClaimNetworkRewardsModal } from './claim/ClaimNetworkRewardsModal'
import { PoolListItem } from '../pool/pool.types'
import { PortfolioSummary } from './PortfolioSummary'
import { PortfolioTable } from './PortfolioTable/PortfolioTable'
import { PortfolioNetworkClaim } from './PortfolioNetworkClaim/PortfolioNetworkClaim'

export default function Portfolio() {
  const [claimByNetworkModalData, setClaimByNetworkModalData] = useState<null | PoolListItem[]>(
    null
  )

  const {
    portfolioData,
    balRewardsData,
    protocolRewardsData,
    claimableRewards,
    poolRewardsMap,
    isLoading,
    poolsByChainMap,
  } = usePortfolio()

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  // TODO: handle errors and no data state
  if (!portfolioData) {
    return null
  }

  const hasStakedPools = (portfolioData.stakedPools.length || 0) > 0
  const hasUnstakedPools = (portfolioData.unstakedPools.length || 0) > 0

  return (
    <Stack width="full" gap="10">
      <PortfolioSummary />
      <PortfolioNetworkClaim />
      <PortfolioTable />

      {hasStakedPools && (
        <Stack>
          <StakedPortfolio pools={portfolioData.stakedPools} poolRewardsMap={poolRewardsMap} />
          <Stack>
            {Object.entries(poolsByChainMap).map(([chain, pools]) => (
              <Stack key={chain} w="30%">
                <Heading size="sm">Claim by {chain} network</Heading>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setClaimByNetworkModalData(pools)
                  }}
                >
                  Claim
                </Button>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
      {claimByNetworkModalData && (
        <ClaimNetworkRewardsModal
          isOpen={!!claimByNetworkModalData}
          onClose={() => setClaimByNetworkModalData(null)}
          pools={claimByNetworkModalData}
        />
      )}
      {hasUnstakedPools && <UnstakedPortfolio pools={portfolioData.unstakedPools} />}
      {balRewardsData && (
        <Stack>
          <Heading>BAL rewards:</Heading>
          {balRewardsData.map((reward, i) => (
            <HStack justifyContent="space-between" key={i}>
              <Text>{reward?.pool.name}</Text>
              <Text>{reward?.formattedBalance}</Text>
            </HStack>
          ))}
        </Stack>
      )}
      {protocolRewardsData && (
        <Stack>
          <Heading>Protocol rewards:</Heading>
          {protocolRewardsData.map(({ tokenAddress, formattedBalance }, i) => (
            <HStack justifyContent="space-between" key={i}>
              <Text>token: {tokenAddress}</Text>
              <Text>{formattedBalance}</Text>
            </HStack>
          ))}
          <ClaimAllVebalRewardsButton />
        </Stack>
      )}

      {claimableRewards && (
        <Stack>
          <Heading>Other token incentives:</Heading>
          {claimableRewards.map(({ pool, tokenAddress, formattedBalance }, i) => (
            <HStack justifyContent="space-between" key={i}>
              <Text>{pool.name}</Text>
              <Text>token: {tokenAddress}</Text>
              <Text>{formattedBalance}</Text>
            </HStack>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
