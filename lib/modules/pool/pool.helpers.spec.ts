import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { aGqlPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { aGqlStakingMock, defaultGaugeAddressMock } from '@/test/msw/builders/gqlStaking.builders'
import { buildGqlPoolHelpers } from './pool.helpers'

const poolHelpers = buildGqlPoolHelpers(aGqlPoolElementMock(), GqlChain.Mainnet)

describe('Gql pool helpers', () => {
  test('returns pool explorer link', () => {
    expect(poolHelpers.getBlockExplorerPoolLink()).toBe(
      'https://etherscan.io/address/0x5c6ee304399dbdb9c8ef030ab642b10820db8f56'
    )
  })

  test('returns gauge explorer link when the pool', () => {
    const staking = aGqlStakingMock()
    const poolHelpers = buildGqlPoolHelpers(aGqlPoolElementMock({ staking }), GqlChain.Mainnet)

    expect(poolHelpers.getBlockExplorerGaugeLink()).toBe(
      `https://etherscan.io/address/${defaultGaugeAddressMock}`
    )
  })

  test('returns gauge explorer link when the pool gauge is not defined', () => {
    expect(poolHelpers.getBlockExplorerGaugeLink()).toBe('https://etherscan.io/address/undefined')
  })
})
