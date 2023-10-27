import { FlowStep } from '@/components/btns/transaction-steps/lib'
import { BuildTransactionLabels } from '@/lib/contracts/transactionLabels'
import { useContractAddress } from '@/lib/contracts/useContractAddress'
import { useManagedTransaction } from '@/lib/contracts/useManagedTransaction'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { MAX_BIGINT } from '@/lib/utils/bigint'
import { useEffect } from 'react'

export function useConstructApproveTokenStep() {
  const { address: userAddress } = useUserAccount()
  const spender = useContractAddress('balancer.vaultV2')

  // const spenderv2 = '0xBA12222222228d8Ba445958a75a0704d566BF2C8'

  // const [tokenAllowanceArgs, setTokenAllowanceArgs] = useState<[Address, bigint]>([
  //   spender || nullAddress,
  //   0n,
  // ])

  // update token approval args
  useEffect(() => {
    if (userAddress && spender) {
      // setTokenAllowanceArgs([spender, MAX_BIGINT])
    }
  }, [userAddress, spender])

  const transaction = useManagedTransaction(
    'balancer.wsETH',
    'approve',
    buildTokenAllowanceLabels(),
    // { args: tokenAllowanceArgs },
    { args: ['0xBA12222222228d8Ba445958a75a0704d566BF2C8', MAX_BIGINT] },
    {
      enabled: !!userAddress,
    }
  )

  // fetch token approval and set this flag
  const hasTokenApproval = () => transaction.result.isSuccess

  const step: FlowStep = {
    ...transaction,
    getLabels: buildTokenAllowanceLabels,
    stepId: 'tokenApproval',
    isComplete: hasTokenApproval(),
  }

  return {
    step,
    // setTokenAllowanceArgs,
  }
}

export const buildTokenAllowanceLabels: BuildTransactionLabels = () => {
  return {
    ready: 'Approve token allowance',
    confirming: 'Approving token allowance',
    tooltip: 'foo',
    description: 'bar',
  }
}
