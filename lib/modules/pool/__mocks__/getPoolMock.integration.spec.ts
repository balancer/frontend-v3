import { gyro2CLP_USDC_DAI, recoveryModePoolId } from '@/lib/debug-helpers'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { getPoolMock } from './getPoolMock'

/**
  Use these tests to manually create/update pool mocks
  Examples of pool mocks used by our tests:
    /lib/modules/pool/__mocks__/...
  We could eventually automate the mock generation by saving the results but we manually copy-paste them for now
*/
describe.skip('Fetch pool data for mock definition', () => {
  // DAO-st-WMATIC
  const polygonNestedId =
    '0x60f46b189736c0d2ae52a79382b64c1e2a86b0d9000200000000000000000cc4' as const
  test('Generate nested pool mock', async () => {
    const pool = await getPoolMock(polygonNestedId, GqlChain.Polygon)

    console.log(JSON.stringify(pool))
  })

  test('Generate gyro pool mock', async () => {
    // 2CLP-USDC-DAI
    const pool = await getPoolMock(gyro2CLP_USDC_DAI, GqlChain.Polygon)

    console.log(JSON.stringify(pool))
  })

  test.only('Generate recovery mode pool mock', async () => {
    const pool = await getPoolMock(recoveryModePoolId, GqlChain.Mainnet)

    console.log(JSON.stringify(pool))
  })
})
