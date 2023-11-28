import { TokenApprovalLabelArgs, buildTokenApprovalLabels } from './approval-labels'

test('Token approval labels for add liquidity', () => {
  const args: TokenApprovalLabelArgs = { actionType: 'AddLiquidity', symbol: 'WETH' }
  const result = buildTokenApprovalLabels(args)
  expect(result).toMatchInlineSnapshot(`
    {
      "confirming": "Approving WETH",
      "description": "Token WETH approval completed",
      "init": "Approve WETH for adding liquidity",
      "tooltip": "You must approve WETH to add liquidity for this token on Balancer.
    Approvals are required once per token, per wallet.",
    }
  `)
})

test('Token approval labels for unapprove', () => {
  const args: TokenApprovalLabelArgs = { actionType: 'Unapprove', symbol: 'WETH' }
  const result = buildTokenApprovalLabels(args)
  expect(result).toMatchInlineSnapshot(`
    {
      "confirming": "Unapproving WETH",
      "description": "Token WETH approval completed",
      "init": "Unapprove WETH",
      "tooltip": "You must unapprove WETH before a new approval value can be set.",
    }
  `)
})
