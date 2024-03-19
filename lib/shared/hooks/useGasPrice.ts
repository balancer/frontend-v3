import { useQuery } from 'wagmi'
import { GqlChain } from '../services/api/generated/graphql'
import { getViemClient } from '../services/viem/viem.client'
import { formatUnits } from 'viem'
import { fNum } from '../utils/numbers'
import { secsToMs } from './useTime'

function getGasPrice(chain: GqlChain) {
  const client = getViemClient(chain)
  return client.getGasPrice()
}

function formatGasPrice(gasPrice: bigint): string {
  return fNum('integer', formatUnits(gasPrice, 9))
}

export function useGasPriceQuery(chain: GqlChain) {
  const query = useQuery(['gasPrice', chain], () => getGasPrice(chain), {
    refetchInterval: secsToMs(30),
  })

  const gasPrice = query.data ? formatGasPrice(query.data) : undefined

  return { ...query, gasPrice }
}
