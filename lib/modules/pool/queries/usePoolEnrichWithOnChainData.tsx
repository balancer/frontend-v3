import {
  GetPoolQuery,
  GqlChain,
  GqlPoolComposableStableNested,
  GetTokenPricesQuery,
} from '@/lib/shared/services/api/generated/graphql'
import {
  Address,
  ContractFunctionParameters,
  formatUnits,
  PublicClient,
  ReadContractParameters,
  zeroAddress,
} from 'viem'
import { cloneDeep, keyBy, sumBy } from 'lodash'
import { balancerV2ComposableStablePoolV5Abi } from '@/lib/modules/web3/contracts/abi/generated'
import { usePublicClient } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { getNetworkConfig } from '@/lib/config/app.config'
import { useTokens } from '@/lib/modules/tokens/TokensProvider'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { isComposableStablePool } from '../pool.utils'
import { Pool } from '../PoolProvider'
import { getVaultSetup } from '../pool.helpers'

export function usePoolEnrichWithOnChainData({
  chain,
  pool,
}: {
  chain: GqlChain
  pool: GetPoolQuery['pool']
}) {
  const config = getNetworkConfig(chain)
  const client = usePublicClient({ chainId: config.chainId })
  const { prices } = useTokens()
  const tokenAddresses = pool.allTokens.map(token => token.address)
  const poolTokenPrices = prices.filter(price => tokenAddresses.includes(price.address))
  const { userAddress } = useUserAccount()

  return useQuery({
    queryKey: ['usePoolEnrichWithOnChainData', { pool, userAddress }],
    queryFn: async () => {
      if (!client) return
      return updateWithOnChainBalanceData({
        pool,
        client,
        tokenPrices: poolTokenPrices,
        userAddress,
      })
    },
    enabled: !!client,
  })
}

async function updateWithOnChainBalanceData({
  pool,
  client,
  tokenPrices,
  userAddress = zeroAddress,
}: {
  pool: GetPoolQuery['pool']
  client: PublicClient
  tokenPrices: GetTokenPricesQuery['tokenPrices']
  userAddress: Address
}): Promise<GetPoolQuery['pool']> {
  const { balances, supplies } = await getBalanceDataForPool({
    pool,
    client,
    userAddress,
  })

  const balancesMap = keyBy(balances, 'poolId')
  const supplyMap = keyBy(supplies, 'poolId')
  const pricesMap = keyBy(tokenPrices, 'address')
  const clone = cloneDeep(pool)
  const filteredTokens = clone.poolTokens.filter(token =>
    pool.displayTokens.find(displayToken => token.address === displayToken.address)
  )

  clone.dynamicData.totalShares = formatUnits(supplyMap[pool.id].totalSupply, 18)

  clone.poolTokens.forEach((token, index) => {
    const tokenBalance = formatUnits(balancesMap[pool.id].balances[index], token.decimals)
    token.balance = tokenBalance
  })

  clone.dynamicData.totalLiquidity = sumBy(
    filteredTokens.map(token => {
      return (pricesMap[token.address]?.price || 0) * parseFloat(token.balance)
    })
  ).toString()

  return clone
}

async function getBalanceDataForPool({
  pool,
  client,
  userAddress = zeroAddress,
}: {
  pool: GetPoolQuery['pool']
  client: PublicClient
  userAddress?: Address
}): Promise<{
  balances: { poolId: string; balances: bigint[] }[]
  supplies: { poolId: string; totalSupply: bigint }[]
}> {
  const calls: {
    poolId: string
    type: 'balances' | 'supply' | 'userBalance'
    call: ContractFunctionParameters
  }[] = [getSupplyCall(pool), getBalancesCall(pool), getUserBalancesCall(pool, userAddress)]

  const response = await client.multicall({ contracts: calls.map(call => call.call) })
  const balances: { poolId: string; balances: bigint[] }[] = []
  const supplies: { poolId: string; totalSupply: bigint }[] = []

  for (let i = 0; i < calls.length; i++) {
    if (calls[i].type === 'balances') {
      balances.push({
        poolId: calls[i].poolId,
        balances: response[i].error ? [] : ((response[i].result as any)[1] as bigint[]),
      })
    } else if (calls[i].type === 'supply') {
      supplies.push({
        poolId: calls[i].poolId,
        totalSupply: response[i].error ? 0n : (response[i].result as bigint),
      })
    }
  }

  return {
    balances,
    supplies,
  }
}

function getBalancesCall(pool: Pool): {
  poolId: string
  type: 'balances'
  call: ReadContractParameters
} {
  const { vaultAddress, balancerVaultAbi } = getVaultSetup(pool)

  return {
    poolId: pool.id,
    type: 'balances',
    call: {
      abi: balancerVaultAbi,
      address: vaultAddress,
      functionName: 'getPoolTokens',
      args: [pool.id],
    },
  }
}

function getUserBalancesCall(
  pool: GetPoolQuery['pool'] | GqlPoolComposableStableNested,
  userAddress: Address
): { poolId: string; type: 'userBalance'; call: ReadContractParameters } {
  return {
    poolId: pool.id,
    type: 'userBalance',
    call: {
      abi: balancerV2ComposableStablePoolV5Abi,
      address: pool.address as Address,
      functionName: 'balanceOf',
      args: [userAddress],
    },
  }
}

function getSupplyCall(pool: GetPoolQuery['pool'] | GqlPoolComposableStableNested): {
  poolId: string
  type: 'supply'
  call: ReadContractParameters
} {
  const isComposableStable = isComposableStablePool(pool)

  return {
    poolId: pool.id,
    type: 'supply',
    call: {
      // composable stable pool has actual and total supply functions exposed
      abi: balancerV2ComposableStablePoolV5Abi,
      address: pool.address as Address,
      functionName: isComposableStable ? 'getActualSupply' : 'totalSupply',
    },
  }
}
