/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { useIterateSteps } from '../useIterateSteps'
import { useClaimStepConfigs } from './useClaimStepConfigs'
import { Address } from 'viem'
import { Pool } from '../../usePool'
import { GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'
import { useDisclosure } from '@chakra-ui/hooks'
import { useBalTokenRewards } from '@/lib/modules/portfolio/useBalRewards'
import { useClaimableBalances } from '@/lib/modules/portfolio/useClaimableBalances'
import { PoolListItem } from '../../pool.types'

export function useClaiming(gaugeAddresses: Address[], pool: Pool) {
  const { isConnected } = useUserAccount()
  const previewModalDisclosure = useDisclosure()
  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  const convertedPool = pool as unknown as PoolListItem // need to change type going from pool to pools for hooks
  const { claimableRewards: thirdPartyRewards } = useClaimableBalances([convertedPool])
  const { balRewardsData: balRewards } = useBalTokenRewards([convertedPool])

  const stepConfigs = useClaimStepConfigs(
    gaugeAddresses,
    pool.chain,
    pool.staking?.type || GqlPoolStakingType.Gauge
  )
  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return {
    isDisabled,
    disabledReason,
    currentStep,
    useOnStepCompleted,
    previewModalDisclosure,
    thirdPartyRewards,
    balRewards,
  }
}
