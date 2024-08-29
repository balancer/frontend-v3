import { Pool } from '@/lib/modules/pool/PoolProvider'
import { GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'

export function getStakingType(pool: Pool) {
  let stakingType: string

  switch (pool.staking?.type) {
    case GqlPoolStakingType.MasterChef:
      stakingType = 'masterchef'
      break
    case GqlPoolStakingType.Vebal:
    default:
      stakingType = 'vebal'
      break
  }

  return stakingType
}
