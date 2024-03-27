import { GqlPoolStaking } from '@/lib/shared/services/api/generated/graphql'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { TransactionLabels, FlowStep } from '@/lib/modules/transactions/transaction-steps/lib'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Address } from 'viem'
import { SupportedChainId } from '@/lib/config/config.types'
import { useSyncCurrentFlowStep } from '../transactions/transaction-steps/useCurrentFlowStep'
import { captureWagmiSimulationError } from '@/lib/shared/utils/query-errors'

function buildStakingDepositLabels(staking?: GqlPoolStaking | null): TransactionLabels {
  const labels: TransactionLabels = {
    init: 'Stake',
    confirming: 'Confirming...',
    confirmed: `BPT deposited in ${staking?.type}!`,
    tooltip: 'TODO DEPOSIT TOOLTIP',
  }
  return labels
}

function buildStakingWithdrawLabels(staking?: GqlPoolStaking | null): TransactionLabels {
  const labels: TransactionLabels = {
    init: 'Unstake',
    confirming: 'Confirming...',
    confirmed: `BPT withdrawn from  ${staking?.type}!`,
    tooltip: 'TODO WITHDRAW TOOLTIP',
  }
  return labels
}

function getStakingConfig(
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

export function useConstructStakingDepositActionStep(
  chainId: SupportedChainId,
  staking?: GqlPoolStaking | null,
  depositAmount?: bigint
): FlowStep {
  const transactionLabels = buildStakingDepositLabels(staking)
  const { userAddress } = useUserAccount()
  const stakingConfig = getStakingConfig(staking, depositAmount, userAddress)

  const deposit = useManagedTransaction(
    stakingConfig?.contractAddress || '',
    stakingConfig?.contractId,
    'deposit',
    transactionLabels,
    chainId,
    { args: stakingConfig?.args },
    {
      enabled: !!staking || !!depositAmount,
      onError(error: unknown) {
        captureWagmiSimulationError(
          error,
          'Error in wagmi tx simulation (Staking deposit transaction)',
          {
            chainId,
            userAddress,
            staking,
            depositAmount,
            stakingConfig,
          }
        )
      },
    }
  )

  const step = useSyncCurrentFlowStep({
    ...deposit,
    id: `${staking?.type}-deposit`,
    stepType: 'stakingDeposit',
    transactionLabels,
    isComplete: () => deposit.result.isSuccess,
  })

  return step
}

export function useConstructStakingWithdrawActionStep(
  chainId: SupportedChainId,
  staking?: GqlPoolStaking | null,
  withdrawAmount?: bigint
): FlowStep {
  const transactionLabels = buildStakingWithdrawLabels(staking)
  const { userAddress } = useUserAccount()
  const stakingConfig = getStakingConfig(staking, withdrawAmount, userAddress)

  const withdraw = useManagedTransaction(
    stakingConfig?.contractAddress || '',
    stakingConfig?.contractId,
    'withdraw',
    transactionLabels,
    chainId,
    { args: stakingConfig?.args },
    {
      enabled: !!staking || !!withdrawAmount,
      onError(error: unknown) {
        captureWagmiSimulationError(
          error,
          'Error in wagmi tx simulation (Staking withdraw transaction)',
          {
            chainId,
            userAddress,
            staking,
            withdrawAmount,
            stakingConfig,
          }
        )
      },
    }
  )

  const step = useSyncCurrentFlowStep({
    ...withdraw,
    id: `${staking?.type}-withdraw`,
    stepType: 'stakingWithdraw',
    transactionLabels,
    isComplete: () => withdraw.result.isSuccess,
  })
  return step
}
