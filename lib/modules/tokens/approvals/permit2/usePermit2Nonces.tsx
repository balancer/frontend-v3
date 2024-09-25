import { getGqlChain, getNetworkConfig } from '@/lib/config/app.config'
import { permit2Abi } from '@balancer/sdk'
import { zipObject } from 'lodash'
import { Address } from 'viem'
import { useReadContracts } from 'wagmi'

export type NoncesByTokenAddress = Record<Address, number>

type Params = {
  chainId: number
  tokenAddresses?: Address[]
  owner?: Address
  enabled: boolean
}
export function usePermit2Nonces({ chainId, tokenAddresses, owner, enabled }: Params) {
  const networkConfig = getNetworkConfig(getGqlChain(chainId))
  const permit2Address = networkConfig.contracts.permit2!
  const balancerRouter = networkConfig.contracts.balancer.router!
  const spender = balancerRouter

  const contracts = tokenAddresses?.map(
    tokenAddress =>
      ({
        chainId,
        address: permit2Address,
        abi: permit2Abi,
        functionName: 'allowance',
        args: [owner, tokenAddress, spender],
      } as const)
  )

  const { data, isLoading } = useReadContracts({
    contracts,
    allowFailure: false,
    query: {
      enabled: enabled && tokenAddresses && tokenAddresses.length > 0 && !!owner,
    },
  })

  const nonces: NoncesByTokenAddress | undefined =
    tokenAddresses && data
      ? zipObject(
          tokenAddresses,
          data.map(result => result[2])
        )
      : undefined

  return {
    isLoadingNonces: isLoading,
    nonces,
  }
}
