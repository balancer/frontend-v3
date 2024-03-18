'use client'
import { PoolName } from '@/lib/modules/pool/PoolName'

import { useClaimStepConfigs } from '@/lib/modules/pool/actions/claim/useClaimStepConfigs'

import { PoolListItem } from '@/lib/modules/pool/pool.types'
import { ChainSlug, chainToSlugMap, slugToChainMap } from '@/lib/modules/pool/pool.utils'
import { ClaimNetworkPoolsLayout } from '@/lib/modules/portfolio/PortfolioClaim/ClaimNetworkPools/ClaimNetworkPoolsLayout'
import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import { TokenIconStack } from '@/lib/modules/tokens/TokenIconStack'
import { useIterateSteps } from '@/lib/modules/transactions/transaction-steps/useIterateSteps'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

import { Button, Card, HStack, Heading, Stack, Text, VStack } from '@chakra-ui/react'
import { capitalize } from 'lodash'
import Link from 'next/link'
import { useParams } from 'next/navigation'

function NetworkClaimAllButton({ pools }: { pools: PoolListItem[] }) {
  const stepConfigs = useClaimStepConfigs(pools)
  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return <VStack w="full">{currentStep.render(useOnStepCompleted)}</VStack>
}

export default function NetworkClaim() {
  const { toCurrency } = useCurrency()
  const { chain } = useParams()

  const { poolsByChainMap } = usePortfolio()
  const gqlChain = slugToChainMap[chain as ChainSlug]

  const pools = poolsByChainMap[gqlChain]
  const { poolRewardsMap, totalFiatClaimableBalanceByChain, isLoadingPortfolio } = usePortfolio()

  const chainName = capitalize(chain as string)
  const claimableFiatBalance = totalFiatClaimableBalanceByChain[gqlChain]

  return (
    <ClaimNetworkPoolsLayout backLink={'/portfolio'} title="Portfolio">
      <HStack
        pb="3"
        justifyContent="space-between"
        borderBottom="1px"
        borderColor="input.borderDefault"
      >
        <HStack gap={4}>
          <NetworkIcon chain={gqlChain} size={12} />

          <Stack gap={0}>
            <Heading size="md">{chainName}</Heading>
            <Text variant="secondary" fontWeight="700">
              Liquidity incentives
            </Text>
          </Stack>
        </HStack>

        <Heading size="md" variant="special">
          {claimableFiatBalance && toCurrency(claimableFiatBalance)}
        </Heading>
      </HStack>

      <Stack py="4">
        {pools?.map(pool => (
          <Card
            variant="level2"
            gap={4}
            key={pool.id}
            p="md"
            shadow="xl"
            flex="1"
            width="100%"
            border="1px solid"
            borderColor="border.base"
          >
            <HStack justifyContent="space-between">
              <HStack>
                <TokenIconStack tokens={pool.displayTokens} chain={pool.chain} size={24} />
              </HStack>

              <Text fontWeight="700">
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

      {pools && pools.length > 0 && <NetworkClaimAllButton pools={pools} />}
    </ClaimNetworkPoolsLayout>
  )
}
