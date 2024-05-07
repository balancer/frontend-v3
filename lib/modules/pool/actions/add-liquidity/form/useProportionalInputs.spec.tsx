import { gyroPoolMock } from '../../../__mocks__/gyroPoolMock'
import { LiquidityActionHelpers } from '../../LiquidityActionHelpers'
import { _calculateProportionalHumanAmountsIn } from './useProportionalInputs'

const helpers = new LiquidityActionHelpers(gyroPoolMock)

describe('calculates and sorts proportional human amounts in', () => {
  const usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
  const daiAddress = '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'

  it('given a new human amount for the first token (USDC)', () => {
    const humanAmountsIn = _calculateProportionalHumanAmountsIn(usdcAddress, '100', helpers)

    expect(humanAmountsIn).toEqual([
      {
        tokenAddress: usdcAddress,
        humanAmount: '100',
      },
      {
        tokenAddress: daiAddress,
        humanAmount: '93.571836178454023742',
      },
    ])
  })

  it('given a new human amount for the second token (DAI)', () => {
    const helpers = new LiquidityActionHelpers(gyroPoolMock)

    const humanAmountsIn = _calculateProportionalHumanAmountsIn(daiAddress, '50', helpers)

    // Sorts the results moving DAI human amount to the first position
    expect(humanAmountsIn).toEqual([
      {
        tokenAddress: daiAddress,
        humanAmount: '50',
      },
      {
        tokenAddress: usdcAddress,
        humanAmount: '53.434881',
      },
    ])
  })
})
