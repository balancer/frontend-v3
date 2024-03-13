'use client'
import { PoolName } from '@/lib/modules/pool/PoolName'
import { ClaimNetworkLayout } from '@/lib/modules/pool/actions/claim/ClaimNetworkLayout'
import { useClaimStepConfigs } from '@/lib/modules/pool/actions/claim/useClaimStepConfigs'

import { PoolListItem } from '@/lib/modules/pool/pool.types'
import { ChainSlug, chainToSlugMap, slugToChainMap } from '@/lib/modules/pool/pool.utils'
import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import { TokenIconStack } from '@/lib/modules/tokens/TokenIconStack'
import { useIterateSteps } from '@/lib/modules/transactions/transaction-steps/useIterateSteps'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

import { Button, Card, HStack, Heading, Stack, Text, VStack } from '@chakra-ui/react'
import { capitalize } from 'lodash'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type NetworkClaimLoaderProps = {
  children(pools: PoolListItem[]): React.ReactNode
}

function NetworkClaimLoader({ children }: NetworkClaimLoaderProps) {
  const { chain } = useParams()
  const { poolsByChainMap } = usePortfolio()
  const gqlChain = slugToChainMap[chain as ChainSlug]
  const pools = poolsByChainMap[gqlChain]

  if (!pools) return <Text>Loading...</Text>

  return <>{children(pools)}</>
}

function NetworkClaim({ pools }: { pools: PoolListItem[] }) {
  const { toCurrency } = useCurrency()
  const { chain } = useParams()
  const { poolRewardsMap, totalFiatClaimableBalanceByChain } = usePortfolio()

  const gqlChain = slugToChainMap[chain as ChainSlug]

  const chainName = capitalize(chain as string)
  const claimableFiatBalance = totalFiatClaimableBalanceByChain[gqlChain]

  const stepConfigs = useClaimStepConfigs(pools)
  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)
  return (
    <ClaimNetworkLayout backLink={'/portfolio'} title="Portfolio">
      <HStack
        py="3"
        justifyContent="space-between"
        borderBottom="1px"
        borderColor="input.borderDefault"
      >
        <HStack>
          <NetworkIcon chain={gqlChain} size={14} />

          <Stack>
            <Heading size="md">{chainName}</Heading>
            <Text>Liquidity incentives</Text>
          </Stack>
        </HStack>

        <Heading size="md" variant="special">
          {claimableFiatBalance && toCurrency(claimableFiatBalance)}
        </Heading>
      </HStack>

      <Stack p="4">
        {pools?.map(pool => (
          <Card variant="level4" gap={4} key={pool.id} p="md" shadow="xl" flex="1" width="100%">
            <HStack justifyContent="space-between">
              <HStack>
                <TokenIconStack tokens={pool.displayTokens} chain={pool.chain} size={24} />
              </HStack>

              <Text>
                {toCurrency(poolRewardsMap[pool.id]?.totalFiatClaimBalance?.toNumber() || 0)}
              </Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Stack gap={0}>
                <Text variant="secondary" fontWeight="medium">
                  {pool.name}
                </Text>
                <PoolName pool={pool} fontWeight="bold" color="fontDefault" />
              </Stack>

              <Link href={`/portfolio/${chainToSlugMap[gqlChain]}/${pool.id}`}>
                <Button
                  variant="secondary"
                  isDisabled={poolRewardsMap[pool.id]?.totalFiatClaimBalance?.isEqualTo(0)}
                >
                  Claim
                </Button>
              </Link>
            </HStack>
          </Card>
        ))}
      </Stack>

      <VStack w="full">{currentStep.render(useOnStepCompleted)}</VStack>
    </ClaimNetworkLayout>
  )
}

export default function NetworkClaimPage() {
  return <NetworkClaimLoader>{pools => <NetworkClaim pools={pools} />}</NetworkClaimLoader>
}
