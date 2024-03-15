'use client'
import { ClaimReviewLayout } from '@/lib/modules/portfolio/PortfolioClaim/ClaimReviewLayout'
import { ClaimReviewTotal } from '@/lib/modules/portfolio/PortfolioClaim/ClaimReviewTotal'
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

function PoolClaimLoader({ children }: { children: (pool: PoolListItem) => React.ReactNode }) {
  const { poolRewardsMap } = usePortfolio()
  const { id } = useParams()

  const pool = poolRewardsMap?.[id as string]

  if (!pool) {
    return null
  }

  return children(pool)
}

function PoolClaim({ pool }: { pool: PoolListItem }) {
  const { poolRewardsMap } = usePortfolio()
  const { chain, id } = useParams()
  const { toCurrency } = useCurrency()
  const router = useRouter()

  const stepConfigs = useClaimStepConfigs([pool])

  const balRewards = poolRewardsMap?.[id as string]?.balReward
  const nonBalRewards = poolRewardsMap?.[id as string]?.claimableRewards || []

  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)
  const hasNoRewards = !nonBalRewards?.length && !balRewards

  return (
    <ClaimReviewLayout backLink={`/portfolio/${chain}`} title={`Review claim: ${chain}`} gap={4}>
      <Card variant="level4" gap={4} p="md" shadow="xl" flex="1" width="100%">
        <Text>You`ll get</Text>
        {balRewards && <RewardTokenRow reward={balRewards} />}

        {nonBalRewards &&
          nonBalRewards.map((reward, idx) => <RewardTokenRow key={idx} reward={reward} />)}
      </Card>

      <ClaimReviewTotal
        total={toCurrency(poolRewardsMap[pool.id]?.totalFiatClaimBalance?.toNumber() || 0)}
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
    </ClaimReviewLayout>
  )
}

export default function PoolClaimPage() {
  return <PoolClaimLoader>{(pool: PoolListItem) => <PoolClaim pool={pool} />}</PoolClaimLoader>
}
