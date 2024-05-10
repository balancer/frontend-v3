import { GqlPoolStaking } from '@/lib/shared/services/api/generated/graphql'
import { TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { Address } from 'viem'

export function buildStakingDepositLabels(staking?: GqlPoolStaking | null): TransactionLabels {
  const labels: TransactionLabels = {
    init: 'Stake',
    confirming: 'Confirming...',
    confirmed: `BPT deposited in ${staking?.type}!`,
    tooltip: 'TODO DEPOSIT TOOLTIP',
  }
  return labels
}

export function getStakingConfig(
  staking?: GqlPoolStaking | null,
  amount?: bigint,
  userAddress?: Address
):
  | {
      contractAddress: string | undefined
      contractId: any // TODO: add typing here
      args: any
    }
  | undefined {
  if (staking) {
    switch (staking.type) {
      case 'MASTER_CHEF':
        return {
          contractAddress: 'masterChefContractAddress', // TODO update this
          contractId: 'balancer.gaugeV5', // TODO change this to farm
          args: [staking.farm?.id, amount, userAddress],
          // TODO: add function name too?
        }
      case 'GAUGE':
        return {
          contractAddress: staking.gauge?.gaugeAddress,
          contractId: 'balancer.gaugeV5',
          args: [amount || 0n],
          // TODO: add function name too?
        }
    }
  }
}
