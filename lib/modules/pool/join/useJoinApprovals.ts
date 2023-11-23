import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { Address } from 'viem'
import { AmountToApprove, filterRequiredTokenApprovals } from './approvals'

export function useJoinApprovals(userAddress: Address, amountsToApprove: AmountToApprove[]) {
  const { chainId } = useNetworkConfig()
  const spenderAddress = useContractAddress('balancer.vaultV2') as Address // Cast to address to avoid TS errors as vaultAddress could be undefined
  const tokenAddresses: Address[] = Object.keys(amountsToApprove) as Address[]
  const vaultAllowances = useTokenAllowances(userAddress, spenderAddress, tokenAddresses)

  const filteredAmountsToApprove = filterRequiredTokenApprovals({
    chainId,
    amountsToApprove,
    currentTokenAllowances: vaultAllowances.allowances || {},
  })

  return {
    isAllowancesLoading: vaultAllowances.isAllowancesLoading,
    filteredAmountsToApprove,
  }
}
