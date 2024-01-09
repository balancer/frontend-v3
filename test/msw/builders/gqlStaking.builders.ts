import {
  GqlChain,
  GqlPoolStaking,
  GqlPoolStakingGaugeStatus,
  GqlPoolStakingType,
} from '@/lib/shared/services/api/generated/graphql'

export const defaultGaugeAddressMock = '0x2d42910d826e5500579d121596e98a6eb33c0a1b'

export function aGqlStakingMock(...options: Partial<GqlPoolStaking>[]): GqlPoolStaking {
  const defaultGqlPoolStaking: GqlPoolStaking = {
    __typename: 'GqlPoolStaking',
    id: 'test-staking-id',
    address: '0x',
    chain: GqlChain.Mainnet,
    type: GqlPoolStakingType.Gauge,
    gauge: {
      __typename: 'GqlPoolStakingGauge',
      id: 'test gauge id',
      gaugeAddress: defaultGaugeAddressMock,
      rewards: [],
      status: GqlPoolStakingGaugeStatus.Active,
      version: 2,
      workingSupply: '',
    },
  }

  return Object.assign({}, defaultGqlPoolStaking, ...options)
}
