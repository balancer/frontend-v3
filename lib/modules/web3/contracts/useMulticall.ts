import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useQueries } from '@tanstack/react-query'
import { groupBy, keyBy, set } from 'lodash'
import { ContractFunctionConfig } from 'viem'
import { multicall } from 'wagmi/actions'
import { getChainId } from '@/lib/config/app.config'
import { useCallback } from 'react'

export type ChainContractConfig = ContractFunctionConfig & { chain: GqlChain; id: string }

export function useMulticall(multicallRequests: ChainContractConfig[]) {
  // Want the results for each chain to be independent of each other so we don't have
  // a large blob of queries that resolves at once, but have to option to have the results
  // of each set of multicalls for each chain to 'stream' through

  // first group all the requests passed in per chain
  const multicallsPerChain = groupBy(multicallRequests, 'chain')

  // key order is preserved
  const suppliedChains = Object.keys(multicallsPerChain)

  const multicallResults = useQueries({
    queries: suppliedChains.map(chain => {
      const multicalls = multicallsPerChain[chain]
      return {
        queryFn: async () => {
          const results = await multicall({
            contracts: multicalls,
            chainId: getChainId(chain as GqlChain),
          })

          // map the result to its id based on the call index
          const idMappedResults = results
            .map((result, i) => ({ ...result, id: multicalls[i].id }))
            .reduce((o, { id, ...rest }) => set(o, id, rest), {})
          return idMappedResults
        },
        queryKey: multicalls,
      }
    }),
  })

  const refetchAll = useCallback(() => {
    multicallResults.forEach(result => result.refetch())
  }, [multicallResults])

  return {
    results: keyBy(
      multicallResults.map((result, i) => ({ ...result, chain: suppliedChains[i] })),
      'chain'
    ),
    isLoading: multicallResults.some(result => result.isLoading),
    refetchAll,
  }
}
