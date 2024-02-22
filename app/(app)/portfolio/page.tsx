'use client'
import { ClaimAllVebalRewardsButton } from '@/lib/modules/pool/actions/claim/ClaimAllVebalRewardsButton'
import { StakedPortfolio } from '@/lib/modules/portfolio/StakedPortfolio'
import { UnstakedPortfolio } from '@/lib/modules/portfolio/UnstakedPortfolio'
import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { HStack, Heading, Stack, Text } from '@chakra-ui/react'

export default function Portfolio() {
  const { toCurrency } = useCurrency()
  const { portfolioData, balRewardsData, protocolRewardsData, claimableRewards } = usePortfolio()

  if (!portfolioData) {
    return null
  }

  const hasStakedPools = (portfolioData.stakedPools.length || 0) > 0
  const hasUnstakedPools = (portfolioData.unstakedPools.length || 0) > 0

  return (
    <Stack width="full">
      {portfolioData.userTotalBalance && (
        <Heading>Total balance: {toCurrency(portfolioData.userTotalBalance?.toNumber())}</Heading>
      )}
      {hasStakedPools && <StakedPortfolio pools={portfolioData.stakedPools} />}
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
