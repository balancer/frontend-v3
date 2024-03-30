import { useMulticall } from '../../web3/contracts/useMulticall'
import { AbiMap } from '../../web3/contracts/AbiMap'
import { useUserAccount } from '../../web3/useUserAccount'
import networkConfigs from '@/lib/config/networks'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { GaugeArg } from './useVebalBoost'

export function useGaugeTotalSupplyAndUserBalance(gauges: GaugeArg[]) {
  const { userAddress } = useUserAccount()

  const totalSupplyRequestChains = gauges
    .map(gauge => gauge.chain)
    .filter(v => v !== GqlChain.Mainnet)

  const vebalTotalSupplyRequests = totalSupplyRequestChains.map(chain => {
    const address = networkConfigs[chain].contracts.veDelegationProxy
    if (!address) throw new Error('veDelegationProxy address not found on: ' + chain)

    return {
      chain,
      id: chain,
      abi: AbiMap['balancer.veDelegationProxyL2'] as any,
      address,
      functionName: 'totalSupply',
      args: [],
    }
  })

  const { results: veBalTotalSupplyL2, isLoading } = useMulticall(vebalTotalSupplyRequests)

  const userVebalBalanceRequestChains = gauges.map(gauge => gauge.chain)

  const userVeBALBalanceRequests = userVebalBalanceRequestChains.map(chain => {
    const address = networkConfigs[chain].contracts.veDelegationProxy
    if (!address) throw new Error('veDelegationProxy address not found on: ' + chain)
    const abi =
      chain === GqlChain.Mainnet
        ? AbiMap['balancer.veDelegationProxy']
        : AbiMap['balancer.veDelegationProxyL2']

    return {
      chain,
      id: chain,
      abi: abi as any,
      address,
      functionName: 'adjustedBalanceOf',
      args: [userAddress],
    }
  })

  const { results: userVeBALBalances, isLoading: isLoadingUserVebalBalances } =
    useMulticall(userVeBALBalanceRequests)

  return {
    veBalTotalSupplyL2,
    userVeBALBalances,
    isLoading: isLoading || isLoadingUserVebalBalances,
  }
}
