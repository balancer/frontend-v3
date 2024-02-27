import { Button, HStack, Stack, Text } from '@chakra-ui/react'
import { PoolListItem } from '../pool/pool.types'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { useState } from 'react'
import { ClaimRewardsModal } from '../pool/actions/claim/ClaimRewardsModal'
import { PoolRewardsDataMap } from './usePortfolio'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

interface PortfolioPoolsListProps {
  pools: PoolListItem[]
  isStaked?: boolean
  poolRewardsMap?: PoolRewardsDataMap
}

interface ClaimModalData {
  pool: PoolListItem
  gaugeAddresses: string[]
}

function getPoolBalance(pool: PoolListItem, isStaked: boolean) {
  const totalBalance = bn(pool.userBalance?.totalBalance || '0')
  const stakedBalance = bn(pool.userBalance?.stakedBalance || '0')
  return isStaked ? stakedBalance : totalBalance.minus(stakedBalance)
}

export function PortfolioPoolsList({
  pools,
  poolRewardsMap,
  isStaked = false,
}: PortfolioPoolsListProps) {
  const [claimModalData, setClaimModalData] = useState<ClaimModalData | null>(null)
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)
  const { toCurrency } = useCurrency()

  function openClaimModal(pool: PoolListItem) {
    const gaugeData = pool.staking?.gauge
    if (!gaugeData) return

    const otherGauges = gaugeData.otherGauges || []

    const gaugeAddresses = [gaugeData.gaugeAddress, ...otherGauges.map(g => g.gaugeAddress)]

    setClaimModalData({
      pool,
      gaugeAddresses,
    })

    setIsClaimModalOpen(true)
  }

  function onModalClose() {
    setIsClaimModalOpen(false)
    setClaimModalData(null)
  }

  return (
    <Stack>
      {pools.map(pool => (
        <HStack justifyContent="space-between" key={pool.id}>
          <HStack>
            <Text>[{pool.chain}]</Text>
            <Text>{pool.name}</Text>
          </HStack>
          <HStack>
            <Text>pool balance: {fNum('token', getPoolBalance(pool, isStaked))}</Text>
            {poolRewardsMap && (
              <Text>
                claimable balance:{' '}
                {toCurrency(poolRewardsMap?.[pool.id]?.totalFiatClaimBalance?.toString() || '0')}
              </Text>
            )}
            {isStaked && (
              <Button
                variant="secondary"
                size="lg"
                isDisabled={
                  !poolRewardsMap?.[pool.id]?.balReward &&
                  !poolRewardsMap?.[pool.id]?.claimableRewards?.length
                }
                onClick={() => openClaimModal(pool)}
              >
                Claim
              </Button>
            )}
          </HStack>
        </HStack>
      ))}

      {claimModalData && (
        <ClaimRewardsModal
          isOpen={isClaimModalOpen}
          onClose={onModalClose}
          balRewards={poolRewardsMap?.[claimModalData.pool.id]?.balReward}
          nonBalRewards={poolRewardsMap?.[claimModalData.pool.id]?.claimableRewards || []}
          pool={claimModalData.pool}
        />
      )}
    </Stack>
  )
}
