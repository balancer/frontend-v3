'use client'
import { PoolName } from '@/lib/modules/pool/PoolName'

import { PoolListItem } from '@/lib/modules/pool/pool.types'
import { ChainSlug, slugToChainMap } from '@/lib/modules/pool/pool.utils'
// eslint-disable-next-line max-len
import { ClaimNetworkPoolsLayout } from '@/lib/modules/portfolio/PortfolioClaim/ClaimNetworkPools/ClaimNetworkPoolsLayout'
import { ClaimPortfolioModal } from '@/lib/modules/portfolio/PortfolioClaim/ClaimPortfolioModal'
import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import { TokenIconStack } from '@/lib/modules/tokens/TokenIconStack'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

import { Button, Card, HStack, Heading, Skeleton, Stack, Text } from '@chakra-ui/react'
import { capitalize } from 'lodash'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function NetworkClaim() {
  const { toCurrency } = useCurrency()
  const { chain } = useParams()

  const { poolsByChainMap } = usePortfolio()
  const gqlChain = slugToChainMap[chain as ChainSlug]

  const pools = poolsByChainMap[gqlChain]

  const { poolRewardsMap, totalFiatClaimableBalanceByChain, isLoadingClaimPoolData } =
    usePortfolio()

  const chainName = capitalize(chain as string)
  const claimableFiatBalance = totalFiatClaimableBalanceByChain[gqlChain]

  const isClaimAllDisabled = pools?.every(pool =>
    poolRewardsMap[pool.id]?.totalFiatClaimBalance?.isEqualTo(0)
  )

  const [modalPools, setModalPools] = useState<PoolListItem[]>([])

  return (
    <ClaimNetworkPoolsLayout backLink={'/portfolio'} title="Portfolio">
      <HStack pb="3" justifyContent="space-between">
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

      <Stack py="4" gap="md">
        {isLoadingClaimPoolData ? (
          <Skeleton height="126px" />
        ) : pools && pools.length > 0 ? (
          pools?.map(pool => (
            <Card key={pool.id} variant="subSection">
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

                <Button
                  onClick={() => {
                    setModalPools([pool])
                  }}
                  variant="secondary"
                  size="sm"
                  isDisabled={poolRewardsMap[pool.id]?.totalFiatClaimBalance?.isEqualTo(0)}
                >
                  Claim
                </Button>
              </HStack>
            </Card>
          ))
        ) : (
          <Text p="10" variant="secondary" textAlign="center">
            You have no liquidity incentives to claim
          </Text>
        )}
      </Stack>

      {pools && pools.length > 0 && (
        <Button
          onClick={() => {
            setModalPools(pools)
          }}
          width="100%"
          variant="secondary"
          isDisabled={isClaimAllDisabled}
        >
          Claim all
        </Button>
      )}

      {modalPools.length > 0 && (
        <ClaimPortfolioModal
          isOpen={modalPools.length > 0}
          onClose={() => setModalPools([])}
          pools={modalPools}
        />
      )}
    </ClaimNetworkPoolsLayout>
  )
}
