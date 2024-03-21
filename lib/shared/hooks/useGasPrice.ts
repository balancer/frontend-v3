import { useQuery } from 'wagmi'
import { GqlChain } from '../services/api/generated/graphql'
import { getViemClient } from '../services/viem/viem.client'
import { formatUnits } from 'viem'
import { bn, fNum } from '../utils/numbers'
import { secs } from './useTime'

function getGasPrice(chain: GqlChain) {
  const client = getViemClient(chain)
  return client.getGasPrice()
}

function formatGasPrice(gasPrice: bigint): string {
  return fNum('integer', formatUnits(gasPrice, 9))
}

function highGasPriceFor(chain: GqlChain) {
  if (chain === GqlChain.Mainnet) return 50
  return 500
}

export function useGasPriceQuery(chain: GqlChain) {
  const query = useQuery(['gasPrice', chain], () => getGasPrice(chain), {
    refetchInterval: secs(30).toMs(),
  })

  const gasPrice = query.data ? formatGasPrice(query.data) : undefined

  const isHighGasPrice = gasPrice ? bn(gasPrice).gte(highGasPriceFor(chain)) : false

  return { ...query, gasPrice, isHighGasPrice }
}
