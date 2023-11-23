import { SupportedChainId } from '@/lib/config/config.types'
import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { MAX_BIGINT } from '@/lib/shared/hooks/useNumbers'
import { filterRequiredTokenApprovals, isDoubleApprovalRequired } from './approvals'

const chainId: SupportedChainId = 1

const amountsToApprove = [
  { tokenAddress: wETHAddress, amount: 10n },
  { tokenAddress: wjAuraAddress, amount: 20n },
]

const currentTokenAllowances = {
  [wETHAddress]: MAX_BIGINT,
  [wjAuraAddress]: MAX_BIGINT,
}

describe('filterRequiredTokenApprovals', () => {
  test('when skipAllowanceCheck', () => {
    expect(
      filterRequiredTokenApprovals({
        chainId,
        amountsToApprove,
        currentTokenAllowances,
        skipAllowanceCheck: true,
      })
    ).toEqual([])
  })

  test('when empty amounts to approve', () => {
    expect(
      filterRequiredTokenApprovals({
        chainId,
        amountsToApprove: [],
        currentTokenAllowances,
      })
    ).toEqual([])
  })

  test('when all token allowances are lesser than the amounts to approve', () => {
    expect(
      filterRequiredTokenApprovals({
        amountsToApprove,
        chainId,
        currentTokenAllowances,
      })
    ).toEqual([])
  })

  test('when some token allowances are greater than the amounts to approve', () => {
    currentTokenAllowances[wETHAddress] = 5n

    expect(
      filterRequiredTokenApprovals({
        amountsToApprove,
        chainId,
        currentTokenAllowances,
      })
    ).toEqual([
      {
        amount: 10n,
        tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      },
    ])
  })
})

describe('isDoubleApprovalRequired', () => {
  test('when token is not special', () => {
    expect(isDoubleApprovalRequired(chainId, wETHAddress, currentTokenAllowances)).toBeFalsy()
  })
  test('when token is special (like USDT)', () => {
    const usdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    currentTokenAllowances[usdtAddress] = 10n
    expect(isDoubleApprovalRequired(chainId, usdtAddress, currentTokenAllowances)).toBeTruthy()
  })
  test('when token is special (like USDT) but current allowance is already zero', () => {
    const usdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    currentTokenAllowances[usdtAddress] = 0n
    expect(isDoubleApprovalRequired(chainId, usdtAddress, currentTokenAllowances)).toBeFalsy()
  })
})
