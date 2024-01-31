import { SupportedChainId } from '@/lib/config/config.types'
import { usdtAddress, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import {
  TokenAmountToApprove,
  getRequiredTokenApprovals,
  isDoubleApprovalRequired,
} from './approval-rules'
import { MAX_BIGINT } from '@/lib/shared/utils/numbers'
import { testRawAmount } from '@/test/utils/numbers'
import { Address } from 'viem'

const chainId: SupportedChainId = 1

const amountsToApprove: TokenAmountToApprove[] = [
  {
    tokenAddress: wETHAddress,
    rawAmount: testRawAmount('10'),
  },
  {
    tokenAddress: wjAuraAddress,
    rawAmount: testRawAmount('10'),
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
        amountsToApprove,
        allowanceFor,
        skipAllowanceCheck: true,
      })
    ).toEqual([])
  })

  test('when empty amounts to approve', () => {
    expect(
      getRequiredTokenApprovals({
        chainId,
        amountsToApprove: [],
        allowanceFor,
      })
    ).toEqual([])
  })

  test('when all token allowances are lesser than the amounts to approve', () => {
    expect(
      getRequiredTokenApprovals({
        amountsToApprove,
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
        amountsToApprove,
        chainId,
        allowanceFor,
      })
    ).toEqual([
      {
        rawAmount: MAX_BIGINT,
        tokenAddress: wETHAddress,
      },
    ])
  })

  test('when one token (USDT) requires double token approval', () => {
    function allowanceFor(): bigint {
      return 5n
    }

    const amountsToApprove: TokenAmountToApprove[] = [
      {
        tokenAddress: usdtAddress,
        rawAmount: testRawAmount('10'),
      },
    ]

    expect(
      getRequiredTokenApprovals({
        amountsToApprove,
        chainId,
        allowanceFor,
      })
    ).toEqual([
      {
        rawAmount: 0n,
        tokenAddress: usdtAddress,
      },
      {
        tokenAddress: usdtAddress,
        rawAmount: MAX_BIGINT,
      },
    ])
  })

  test('when one token (USDT) requires double token approval but it does not have current allowance', () => {
    function allowanceFor(): bigint {
      return 0n
    }

    const amountsToApprove: TokenAmountToApprove[] = [
      {
        tokenAddress: usdtAddress,
        rawAmount: testRawAmount('10'),
      },
    ]

    expect(
      getRequiredTokenApprovals({
        amountsToApprove,
        chainId,
        allowanceFor,
      })
    ).toEqual([
      {
        rawAmount: MAX_BIGINT,
        tokenAddress: usdtAddress,
      },
    ])
  })
})

describe('isDoubleApprovalRequired', () => {
  test('when token is not special', () => {
    expect(isDoubleApprovalRequired(chainId, wETHAddress, allowanceFor)).toBeFalsy()
  })

  test('when token is special (like USDT)', () => {
    function allowanceFor(): bigint {
      return 10n
    }
    const usdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    expect(isDoubleApprovalRequired(chainId, usdtAddress, allowanceFor)).toBeTruthy()
  })
  test('when token is special (like USDT) but current allowance is already zero', () => {
    const usdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    function allowanceFor(): bigint {
      return 0n
    }
    expect(isDoubleApprovalRequired(chainId, usdtAddress, allowanceFor)).toBeFalsy()
  })
})
