import {
  GetPoolQuery,
  GqlChain,
  GqlPoolLinearNested,
  GqlPoolComposableStableNested,
  GqlTokenPrice,
} from '@/lib/shared/services/api/generated/graphql'
import { Address, formatUnits, PublicClient, zeroAddress } from 'viem'
import { cloneDeep, keyBy, sumBy } from 'lodash'
import { ContractFunctionConfig } from 'viem/types/contract'
import {
  balancerV2ComposableStablePoolV5ABI,
  balancerV2Erc4626LinearPoolV3ABI,
  balancerV2VaultABI,
} from '@/lib/modules/web3/contracts/abi/generated'
import { usePublicClient, useQuery } from 'wagmi'
import { getNetworkConfig } from '@/lib/config/app.config'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { WAD } from '@balancer/sdk'
import { useUserAccount } from '../../web3/useUserAccount'
import { isComposableStablePool, isLinearPool } from '../pool.utils'

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

  return useQuery(['usePoolEnrichWithOnChainData', { pool }], async () => {
    return updateWithOnChainBalanceData({
      pool,
      client,
      tokenPrices: poolTokenPrices,
      vaultV2Address: config.contracts.balancer.vaultV2,
      userAddress,
    })
  })
}

async function updateWithOnChainBalanceData({
  pool,
  client,
  tokenPrices,
  vaultV2Address,
  userAddress = zeroAddress,
}: {
  pool: GetPoolQuery['pool']
  client: PublicClient
  tokenPrices: GqlTokenPrice[]
  vaultV2Address: Address
  userAddress: Address
}): Promise<GetPoolQuery['pool']> {
  const { balances, supplies } = await getBalanceDataForPool({
    pool,
    client,
    vaultV2Address,
    userAddress,
  })

  const balancesMap = keyBy(balances, 'poolId')
  const supplyMap = keyBy(supplies, 'poolId')
  const pricesMap = keyBy(tokenPrices, 'address')
  const clone = cloneDeep(pool)

  clone.dynamicData.totalShares = formatUnits(supplyMap[pool.id].totalSupply, 18)

  for (const token of clone.tokens) {
    if (
      token.__typename === 'GqlPoolTokenLinear' ||
      token.__typename === 'GqlPoolTokenComposableStable'
    ) {
      token.pool.totalShares = formatUnits(supplyMap[token.pool.id].totalSupply, 18)
    }

    const tokenBalance = formatUnits(balancesMap[pool.id].balances[token.index], token.decimals)
    token.balance = tokenBalance
    token.totalBalance = tokenBalance

    if (
      token.__typename === 'GqlPoolTokenLinear' ||
      token.__typename === 'GqlPoolTokenComposableStable'
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
  userAddress = zeroAddress,
}: {
  pool: GetPoolQuery['pool']
  client: PublicClient
  vaultV2Address: Address
  userAddress?: Address
}): Promise<{
  balances: { poolId: string; balances: bigint[] }[]
  supplies: { poolId: string; totalSupply: bigint }[]
}> {
  const poolIds: string[] = [pool.id]

  const calls: {
    poolId: string
    type: 'balances' | 'supply' | 'userBalance'
    call: ContractFunctionConfig
  }[] = [
    getSupplyCall(pool),
    getBalancesCall(pool.id, vaultV2Address),
    getUserBalancesCall(pool, userAddress),
  ]

  for (const token of pool.tokens) {
    if (token.__typename === 'GqlPoolTokenLinear') {
      poolIds.push(token.pool.id)
      calls.push(getSupplyCall(token.pool))
      calls.push(getBalancesCall(token.pool.id, vaultV2Address))
    } else if (token.__typename === 'GqlPoolTokenComposableStable') {
      poolIds.push(token.pool.id)
      calls.push(getSupplyCall(token.pool))
      calls.push(getBalancesCall(token.pool.id, vaultV2Address))
    }

    if (token.__typename === 'GqlPoolTokenComposableStable') {
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

function getBalancesCall(
  poolId: string,
  vaultV2Address: Address
): { poolId: string; type: 'balances'; call: ContractFunctionConfig } {
  return {
    poolId,
    type: 'balances',
    call: {
      abi: balancerV2VaultABI,
      address: vaultV2Address,
      functionName: 'getPoolTokens',
      args: [poolId],
    },
  }
}

function getUserBalancesCall(
  pool: GetPoolQuery['pool'] | GqlPoolComposableStableNested | GqlPoolLinearNested,
  userAddress: Address
): { poolId: string; type: 'userBalance'; call: ContractFunctionConfig } {
  const isLinear = isLinearPool(pool)

  return {
    poolId: pool.id,
    type: 'userBalance',
    call: {
      abi: isLinear ? balancerV2Erc4626LinearPoolV3ABI : balancerV2ComposableStablePoolV5ABI,
      address: pool.address as Address,
      functionName: 'balanceOf',
      args: [userAddress],
    },
  }
}

function getSupplyCall(
  pool: GetPoolQuery['pool'] | GqlPoolComposableStableNested | GqlPoolLinearNested
): {
  poolId: string
  type: 'supply'
  call: ContractFunctionConfig
} {
  const isLinear = isLinearPool(pool)
  const isComposableStable = isComposableStablePool(pool)

  return {
    poolId: pool.id,
    type: 'supply',
    call: {
      abi: isLinear
        ? balancerV2Erc4626LinearPoolV3ABI
        : // composable stable pool has actual and total supply functions exposed
          balancerV2ComposableStablePoolV5ABI,
      address: pool.address as Address,
      functionName: isComposableStable
        ? 'getActualSupply'
        : isLinear
        ? 'getVirtualSupply'
        : 'totalSupply',
    },
  }
}
