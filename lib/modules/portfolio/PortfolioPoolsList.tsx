import { Button, HStack, Stack, Text } from '@chakra-ui/react'
import { PoolListItem } from '../pool/pool.types'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { useState } from 'react'
import { Hex } from 'viem'
import { ClaimRewardsModal } from '../pool/actions/claim/ClaimRewardsModal'
import { PoolRewardsDataMap } from './usePortfolio'

interface PortfolioPoolsListProps {
  pools: PoolListItem[]
  isStaked?: boolean
  poolRewardsMap?: PoolRewardsDataMap
}

function getBalance(pool: PoolListItem, isStaked: boolean) {
  const totalBalance = bn(pool.userBalance?.totalBalance || '0')
  const stakedBalance = bn(pool.userBalance?.stakedBalance || '0')
  return isStaked ? stakedBalance : totalBalance.minus(stakedBalance)
}

interface ClaimModalData {
  pool: PoolListItem
  gaugeAddresses: string[]
}

export function PortfolioPoolsList({
  pools,
  poolRewardsMap,
  isStaked = false,
}: PortfolioPoolsListProps) {
  const [claimModalData, setClaimModalData] = useState<ClaimModalData | null>(null)
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)
  console.log('pools', pools)

  function openClaimModal(pool: PoolListItem) {
    const gaugeData = pool.staking?.gauge
    if (!gaugeData) return

    const otherGauges = gaugeData.otherGauges || []

    const gaugeAddresses = [gaugeData.gaugeAddress, ...otherGauges.map(g => g.gaugeAddress)]
    setClaimModalData({
      pool,
      gaugeAddresses,
    })
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

  console.log('poolRewardsMap', poolRewardsMap)
  return (
    <Stack>
      {pools.map(pool => (
        <HStack justifyContent="space-between" key={pool.id}>
          <Text>{pool.name}</Text>
          <Text>{fNum('token', getBalance(pool, isStaked))}</Text>

          {isStaked && (
            <Button
              variant="secondary"
              w="full"
              size="lg"
              isDisabled={false}
              onClick={() => openClaimModal(pool)}
            >
              Claim
            </Button>
          )}
        </HStack>
      ))}

      {claimModalData && (
        <ClaimRewardsModal
          isOpen={isClaimModalOpen}
          onClose={onModalClose}
          balRewards={poolRewardsMap?.[claimModalData.pool.id]?.balReward}
          // nonBalRewards={poolRewardsMap?.[claimModalData.pool.id]?.claimableReward || []}
        />
      )}
    </Stack>
  )
}
