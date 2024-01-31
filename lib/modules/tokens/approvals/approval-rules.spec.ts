import { SupportedChainId } from '@/lib/config/config.types'
import { usdtAddress, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { MAX_BIGINT } from '@/lib/shared/utils/numbers'
import { testRawAmount } from '@/test/utils/numbers'
import { InputAmount } from '@balancer/sdk'
import { Address } from 'viem'
import { getRequiredTokenApprovals } from './approval-rules'

const chainId: SupportedChainId = 1

const inputAmounts: InputAmount[] = [
  {
    address: wETHAddress,
    rawAmount: testRawAmount('10'),
    decimals: 18,
  },
  {
    address: wjAuraAddress,
    rawAmount: testRawAmount('10'),
    decimals: 18,
  },
]

function allowanceFor(): bigint {
  return MAX_BIGINT
}

describe('getRequiredTokenApprovals', () => {
  test('when skipAllowanceCheck', () => {
    expect(
      getRequiredTokenApprovals({
        chainId,
        inputAmounts,
        allowanceFor,
        skipAllowanceCheck: true,
      })
    ).toEqual([])
  })

  test('when empty amounts to approve', () => {
    expect(
      getRequiredTokenApprovals({
        chainId,
        inputAmounts: [],
        allowanceFor,
      })
    ).toEqual([])
  })

  test('when all token allowances are lesser than the amounts to approve', () => {
    expect(
      getRequiredTokenApprovals({
        inputAmounts,
        chainId,
        allowanceFor,
      })
    ).toEqual([])
  })

  test('when some token allowances are greater than the amounts to approve', () => {
    function allowanceFor(tokenAddress: Address): bigint {
      if (tokenAddress === wETHAddress) return 5n
      return MAX_BIGINT
    }

    expect(
      getRequiredTokenApprovals({
        inputAmounts,
        chainId,
        allowanceFor,
      })
    ).toEqual([
      {
        tokenAddress: wETHAddress,
        requiredRawAmount: 10000000000000000000n,
        requestedRawAmount: MAX_BIGINT,
      },
    ])
  })

  test('when one token (USDT) requires double token approval', () => {
    function allowanceFor(): bigint {
      return 5n
    }

    const inputAmounts: InputAmount[] = [
      {
        address: usdtAddress,
        rawAmount: testRawAmount('10'),
        decimals: 18,
      },
    ]

    expect(
      getRequiredTokenApprovals({
        inputAmounts,
        chainId,
        allowanceFor,
      })
    ).toEqual([
      {
        requiredRawAmount: 0n,
        requestedRawAmount: 0n,
        tokenAddress: usdtAddress,
      },
      {
        tokenAddress: usdtAddress,
        requiredRawAmount: 10000000000000000000n,
        requestedRawAmount: MAX_BIGINT,
      },
    ])
  })

  test('when one token (USDT) requires double token approval but it does not have current allowance', () => {
    function allowanceFor(): bigint {
      return 0n
    }

    const inputAmounts: InputAmount[] = [
      {
        address: usdtAddress,
        rawAmount: testRawAmount('10'),
        decimals: 18,
      },
    ]

    expect(
      getRequiredTokenApprovals({
        inputAmounts,
        chainId,
        allowanceFor,
      })
    ).toEqual([
      {
        requiredRawAmount: 10000000000000000000n,
        requestedRawAmount: MAX_BIGINT,
        tokenAddress: usdtAddress,
      },
    ])
  })
})
