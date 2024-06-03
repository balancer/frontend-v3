'use client'
import { PoolName } from '@/lib/modules/pool/PoolName'
import { ClaimProvider } from '@/lib/modules/pool/actions/claim/ClaimProvider'

import { PoolListItem } from '@/lib/modules/pool/pool.types'
import { ChainSlug, slugToChainMap } from '@/lib/modules/pool/pool.utils'
// eslint-disable-next-line max-len
import { ClaimNetworkPoolsLayout } from '@/lib/modules/portfolio/PortfolioClaim/ClaimNetworkPools/ClaimNetworkPoolsLayout'
import { ClaimPortfolioModal } from '@/lib/modules/portfolio/PortfolioClaim/ClaimPortfolioModal'
import { usePortfolio } from '@/lib/modules/portfolio/PortfolioProvider'
import { TokenIconStack } from '@/lib/modules/tokens/TokenIconStack'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

import { Button, Card, HStack, Heading, Skeleton, Stack, Text, VStack } from '@chakra-ui/react'
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
    <ClaimProvider pools={pools}>
      <TransactionStateProvider>
        <ClaimNetworkPoolsLayout backLink={'/portfolio'} title="Portfolio">
          <HStack pb="3" justifyContent="space-between">
            <HStack spacing="sm">
              <NetworkIcon chain={gqlChain} size={16} />

              <Stack spacing="none">
                <Heading size="md">{chainName}</Heading>
                <Text variant="secondary" fontWeight="700">
                  Liquidity incentives
                </Text>
              </Stack>
            </HStack>

            <Heading size="lg" variant="special">
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
                    <VStack align="start">
                      <HStack>
                        <Text fontWeight="bold" fontSize="lg">
                          Pool
                        </Text>
                        <PoolName pool={pool} fontWeight="bold" fontSize="lg" />
                      </HStack>
                      <TokenIconStack tokens={pool.displayTokens} chain={pool.chain} size={36} />
                    </VStack>

                    <VStack>
                      <Text fontSize="xl" variant="special">
                        {toCurrency(
                          poolRewardsMap[pool.id]?.totalFiatClaimBalance?.toNumber() || 0
                        )}
                      </Text>
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
                    </VStack>
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
              size="lg"
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
      </TransactionStateProvider>
    </ClaimProvider>
  )
}
