import {
  GetPoolQuery,
  GqlChain,
  GqlPoolLinearNested,
  GqlPoolPhantomStableNested,
  GqlPoolUnion,
  GqlTokenPrice,
} from '@/lib/shared/services/api/generated/graphql'
import { Address, formatUnits, PublicClient } from 'viem'
import { cloneDeep, keyBy, sumBy } from 'lodash'
import {
  balancerV2ComposableStablePoolV5ABI,
  balancerV2Erc4626LinearPoolV3ABI,
  balancerV2VaultABI,
} from '@/lib/modules/web3/contracts/abi/generated'
import { usePublicClient, useQuery } from 'wagmi'
import { getNetworkConfig } from '@/lib/config/app.config'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { WAD } from '@balancer/sdk'

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

  return useQuery(['usePoolEnrichWithOnChainData', pool.id], async () => {
    return updateWithOnChainBalanceData({
      pool,
      client,
      tokenPrices: poolTokenPrices,
      vaultV2Address: config.contracts.balancer.vaultV2,
    })
  })
}

async function updateWithOnChainBalanceData({
  pool,
  client,
  tokenPrices,
  vaultV2Address,
}: {
  pool: GetPoolQuery['pool']
  client: PublicClient
  tokenPrices: GqlTokenPrice[]
  vaultV2Address: Address
}): Promise<GetPoolQuery['pool']> {
  const { balances, supplies } = await getBalanceDataForPool({ pool, client, vaultV2Address })
  const balancesMap = keyBy(balances, 'poolId')
  const supplyMap = keyBy(supplies, 'poolId')
  const pricesMap = keyBy(tokenPrices, 'address')
  const clone = cloneDeep(pool)

  clone.dynamicData.totalShares = formatUnits(supplyMap[pool.id].totalSupply, 18)

  for (const token of clone.tokens) {
    if (
      token.__typename === 'GqlPoolTokenLinear' ||
      token.__typename === 'GqlPoolTokenPhantomStable'
    ) {
      token.pool.totalShares = formatUnits(supplyMap[token.pool.id].totalSupply, 18)
    }

    const tokenBalance = formatUnits(balancesMap[pool.id].balances[token.index], token.decimals)
    token.balance = tokenBalance
    token.totalBalance = tokenBalance

    if (
      token.__typename === 'GqlPoolTokenLinear' ||
      token.__typename === 'GqlPoolTokenPhantomStable'
    ) {
      const percentOfNestedSupply =
        (balancesMap[pool.id].balances[token.index] * WAD) / supplyMap[token.pool.id].totalSupply

      for (const nestedToken of token.pool.tokens) {
        if (nestedToken.address === token.pool.address) {
          continue // skip phantom bpt
        }

        nestedToken.totalBalance = formatUnits(
          balancesMap[token.pool.id].balances[nestedToken.index],
          nestedToken.decimals
        )

        nestedToken.balance = formatUnits(
          (balancesMap[token.pool.id].balances[nestedToken.index] * percentOfNestedSupply) / WAD,
          nestedToken.decimals
        )

        if (nestedToken.__typename === 'GqlPoolTokenLinear') {
          nestedToken.pool.totalShares = formatUnits(supplyMap[nestedToken.pool.id].totalSupply, 18)

          const percentOfLinearSupplyNested =
            (balancesMap[token.pool.id].balances[nestedToken.index] * WAD) /
            supplyMap[nestedToken.pool.id].totalSupply

          for (const nestedLinearToken of nestedToken.pool.tokens) {
            if (nestedLinearToken.address === nestedToken.pool.address) {
              continue // skip phantom bpt
            }

            const nestedLinearTokenBalance =
              balancesMap[nestedToken.pool.id].balances[nestedLinearToken.index]

            nestedLinearToken.balance = formatUnits(
              (((nestedLinearTokenBalance * percentOfNestedSupply) / WAD) *
                percentOfLinearSupplyNested) /
                WAD,
              nestedLinearToken.decimals
            )

            nestedLinearToken.totalBalance = formatUnits(
              nestedLinearTokenBalance,
              nestedLinearToken.decimals
            )
          }
        }
      }
    }
  }

  clone.dynamicData.totalLiquidity = sumBy(
    clone.tokens.map(token => pricesMap[token.address].price * parseFloat(token.balance))
  ).toString()

  return clone
}

async function getBalanceDataForPool({
  pool,
  client,
  vaultV2Address,
}: {
  pool: GetPoolQuery['pool']
  client: PublicClient
  vaultV2Address: Address
}): Promise<{
  balances: { poolId: string; balances: bigint[] }[]
  supplies: { poolId: string; totalSupply: bigint }[]
}> {
  pool.allTokens.map(token => token)
  const poolIds: string[] = [pool.id]
  const calls = [getSupplyCall(pool), getBalancesCall(pool.id, vaultV2Address)]

  for (const token of pool.tokens) {
    if (token.__typename === 'GqlPoolTokenLinear') {
      poolIds.push(token.pool.id)
      calls.push(getSupplyCall(token.pool))
      calls.push(getBalancesCall(token.pool.id, vaultV2Address))
    } else if (token.__typename === 'GqlPoolTokenPhantomStable') {
      poolIds.push(token.pool.id)
      calls.push(getSupplyCall(token.pool))
      calls.push(getBalancesCall(token.pool.id, vaultV2Address))
    }

    if (token.__typename === 'GqlPoolTokenPhantomStable') {
      for (const nestedToken of token.pool.tokens) {
        if (nestedToken.__typename === 'GqlPoolTokenLinear') {
          poolIds.push(nestedToken.pool.id)
          calls.push(getSupplyCall(nestedToken.pool))
          calls.push(getBalancesCall(nestedToken.pool.id, vaultV2Address))
        }
      }
    }
  }

  const response = await client.multicall({ contracts: calls.map(call => call.call) })
  const balances: { poolId: string; balances: bigint[] }[] = []
  const supplies: { poolId: string; totalSupply: bigint }[] = []

  for (let i = 0; i < calls.length; i++) {
    if (calls[i].type === 'balances') {
      balances.push({
        poolId: calls[i].poolId,
        balances: response[i].error ? [] : (response[i].result as any)[1],
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

function getBalancesCall(poolId: string, vaultV2Address: Address) {
  return {
    poolId,
    type: 'balances',
    call: {
      abi: balancerV2VaultABI,
      address: vaultV2Address,
      functionName: 'getPoolTokens',
      args: [poolId as Address],
    } as const,
  }
}

function getSupplyCall(pool: GqlPoolUnion | GqlPoolPhantomStableNested | GqlPoolLinearNested) {
  const isLinear = pool.__typename === 'GqlPoolLinear' || pool.__typename == 'GqlPoolLinearNested'
  const isPhantomStable =
    pool.__typename === 'GqlPoolPhantomStable' || pool.__typename == 'GqlPoolPhantomStableNested'

  const poolAddress = pool.address as Address

  const context = {
    poolId: pool.id,
    type: 'supply',
  }

  if (isLinear) {
    return {
      ...context,
      call: {
        abi: balancerV2Erc4626LinearPoolV3ABI,
        address: poolAddress,
        functionName: 'getVirtualSupply',
      } as const,
    }
  }
  if (isPhantomStable) {
    return {
      ...context,
      call: {
        // composable stable pool has actual and total supply functions exposed
        abi: balancerV2ComposableStablePoolV5ABI,
        address: poolAddress,
        functionName: 'getActualSupply',
      } as const,
    }
  }
  // Default
  return {
    ...context,
    call: {
      // composable stable pool has actual and total supply functions exposed
      abi: balancerV2ComposableStablePoolV5ABI,
      address: poolAddress,
      functionName: 'totalSupply',
    } as const,
  }
}
