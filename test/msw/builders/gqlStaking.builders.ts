import { GqlPoolStaking, GqlPoolStakingGauge } from '@/lib/shared/services/api/generated/graphql'
import { DeepPartial } from '@apollo/client/utilities'
import { mock } from 'vitest-mock-extended'

export const defaultGaugeAddressMock = '0x-test-gauge-address'

export function aGqlStakingMock(...options: Partial<GqlPoolStaking>[]): GqlPoolStaking {
  const defaultPoolStakingDataMock: DeepPartial<GqlPoolStaking> = mock<GqlPoolStaking>()
  const defaultPoolStakingGAugeDataMock: DeepPartial<GqlPoolStakingGauge> =
    mock<GqlPoolStakingGauge>()
  defaultPoolStakingGAugeDataMock.gaugeAddress = defaultGaugeAddressMock

  defaultPoolStakingDataMock.gauge = defaultPoolStakingGAugeDataMock

  return Object.assign({}, defaultPoolStakingDataMock, ...options)
}
