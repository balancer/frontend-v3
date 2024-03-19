'use client'
import { ClaimPoolLayout } from '@/lib/modules/portfolio/PortfolioClaim/ClaimPool/ClaimPoolLayout'
import { ClaimTotal } from '@/lib/modules/portfolio/PortfolioClaim/ClaimTotal'
import { useClaimStepConfigs } from '@/lib/modules/pool/actions/claim/useClaimStepConfigs'

import { PoolListItem } from '@/lib/modules/pool/pool.types'
import { ClaimableReward } from '@/lib/modules/portfolio/PortfolioClaim/useClaimableBalances'
import { BalTokenReward } from '@/lib/modules/portfolio/PortfolioClaim/useBalRewards'
import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { useIterateSteps } from '@/lib/modules/transactions/transaction-steps/useIterateSteps'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { Button, Card, Text, VStack } from '@chakra-ui/react'

import { useParams, useRouter } from 'next/navigation'
import { ChainSlug, slugToChainMap } from '@/lib/modules/pool/pool.utils'

function RewardTokenRow({ reward }: { reward: ClaimableReward | BalTokenReward }) {
  if (reward.formattedBalance === '0') return null
  return (
    <TokenRow
      address={reward.tokenAddress}
      value={reward.formattedBalance}
      chain={reward.pool.chain}
    />
  )
}

function PoolClaimLoader({ children }: { children: (pools: PoolListItem[]) => React.ReactNode }) {
  const { poolRewardsMap, rewardsByChainMap } = usePortfolio()
  const { id, chain } = useParams()
  const chainName = slugToChainMap[chain as ChainSlug]
  const isClaimAllPage = id === 'all'

  const pools = isClaimAllPage ? rewardsByChainMap[chainName] : [poolRewardsMap?.[id as string]]

  if (!pools) {
    return null
  }

  return children(pools)
}

function PoolClaim({ pools }: { pools: PoolListItem[] }) {
  const { poolRewardsMap } = usePortfolio()
  const { chain } = useParams()
  const { toCurrency } = useCurrency()
  const router = useRouter()

  const stepConfigs = useClaimStepConfigs(pools)

  const balRewards = pools.map(pool => poolRewardsMap?.[pool.id]?.balReward)
  const nonBalRewards = pools.flatMap(pool => poolRewardsMap?.[pool.id]?.claimableRewards || [])

  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)
  const hasNoRewards = !nonBalRewards?.length && !balRewards.length

  return (
    <ClaimPoolLayout backLink={`/portfolio/${chain}`} title={`Review claim: ${chain}`} gap={4}>
      <Card variant="level2" gap={4} p="md" shadow="xl" flex="1" width="100%">
        <Text fontWeight="700">You`ll get</Text>
        {balRewards &&
          balRewards.map(
            reward =>
              reward && (
                <RewardTokenRow
                  key={`${reward?.tokenAddress}-${reward?.gaugeAddress}`}
                  reward={reward}
                />
              )
          )}

        {nonBalRewards &&
          nonBalRewards.map((reward, idx) => <RewardTokenRow key={idx} reward={reward} />)}
      </Card>

      <ClaimTotal
        total={toCurrency(poolRewardsMap[pools[0].id]?.totalFiatClaimBalance?.toNumber() || 0)}
      />

      <VStack w="full">
        {hasNoRewards ? (
          <Button
            w="full"
            size="lg"
            onClick={() => {
              router.back()
            }}
          >
            Close
          </Button>
        ) : (
          currentStep.render(useOnStepCompleted)
        )}
      </VStack>
    </ClaimPoolLayout>
  )
}

export default function PoolClaimPage() {
  return <PoolClaimLoader>{(pools: PoolListItem[]) => <PoolClaim pools={pools} />}</PoolClaimLoader>
}
