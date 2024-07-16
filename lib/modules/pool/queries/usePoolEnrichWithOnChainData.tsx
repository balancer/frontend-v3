import { cloneDeep } from 'lodash'
import { Address, formatUnits } from 'viem'
import { useReadContracts } from 'wagmi'
import { useTokens } from '../../tokens/TokensProvider'
import { balancerV3VaultAbi } from '../../web3/contracts/abi/balancerV3Abi'
import { weightedPoolV3Abi } from '../../web3/contracts/abi/weightedPoolV3Abi'
import { Pool } from '../PoolProvider'
import { BPT_DECIMALS } from '../pool.constants'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { bn, safeSum } from '@/lib/shared/utils/numbers'
import { getVaultConfig, isV3Pool } from '../pool.helpers'
import { getChainId } from '@/lib/config/app.config'
import {
  balancerV2ComposableStablePoolV5Abi,
  balancerV2VaultAbi,
} from '../../web3/contracts/abi/generated'
import { isComposableStablePool } from '../pool.utils'

export function usePoolEnrichWithOnChainData(pool: Pool) {
  const { priceFor } = useTokens()
  const { isLoading, poolTokenBalances, totalSupply, refetch } = usePoolOnchainData(pool)
  const clone = enrichPool({ isLoading, pool, priceFor, poolTokenBalances, totalSupply })

  return { isLoading, pool: clone, refetch }
}

function usePoolOnchainData(pool: Pool) {
  const v2Query = useV2PoolOnchainData(pool)

  const v2Result = {
    ...v2Query,
    poolTokenBalances: v2Query.data?.[0][1],
    totalSupply: v2Query.data?.[1],
  }

  const v3Query = useV3PoolOnchainData(pool)

  const v3Result = {
    ...v3Query,
    poolTokenBalances: v3Query.data?.[0][2],
    totalSupply: v3Query.data?.[1],
  }

  return isV3Pool(pool) ? v3Result : v2Result
}

function useV3PoolOnchainData(pool: Pool) {
  const { vaultAddress } = getVaultConfig(pool)
  const chainId = getChainId(pool.chain)

  return useReadContracts({
    query: {
      enabled: isV3Pool(pool),
    },
    allowFailure: false,
    contracts: [
      {
        chainId,
        abi: balancerV3VaultAbi,
        address: vaultAddress,
        functionName: 'getPoolTokenInfo',
        args: [pool.address as Address],
      },
      {
        chainId,
        abi: weightedPoolV3Abi,
        address: pool.address as Address,
        functionName: 'totalSupply',
        args: [],
      },
    ],
  })
}

function useV2PoolOnchainData(pool: Pool) {
  const { vaultAddress } = getVaultConfig(pool)
  const chainId = getChainId(pool.chain)
  const isComposableStable = isComposableStablePool(pool)

  return useReadContracts({
    query: {
      enabled: !isV3Pool(pool),
    },
    allowFailure: false,
    contracts: [
      {
        chainId,
        abi: balancerV2VaultAbi,
        address: vaultAddress,
        functionName: 'getPoolTokens',
        args: [pool.id as Address],
      },
      {
        chainId,
        // composable stable pool has actual and total supply functions exposed
        abi: balancerV2ComposableStablePoolV5Abi,
        address: pool.address as Address,
        functionName: isComposableStable ? 'getActualSupply' : 'totalSupply',
      } as const,
    ],
  })
}

type Params = {
  isLoading: boolean
  pool: Pool
  priceFor: (address: string, chain: GqlChain) => number
  poolTokenBalances: readonly bigint[] | undefined
  totalSupply: bigint | undefined
}
function enrichPool({ isLoading, pool, priceFor, poolTokenBalances, totalSupply }: Params) {
  if (isLoading) return pool

  const clone = cloneDeep(pool)

  const filteredTokens = clone.poolTokens.filter(token =>
    pool.displayTokens.find(displayToken => token.address === displayToken.address)
  )

  clone.poolTokens.forEach((token, index) => {
    if (!poolTokenBalances) return
    const tokenBalance = formatUnits(poolTokenBalances[index], token.decimals)
    token.balance = tokenBalance
    token.balanceUSD = bn(tokenBalance).times(priceFor(token.address, pool.chain)).toString()
  })

  clone.dynamicData.totalLiquidity = safeSum(
    filteredTokens.map(
      token => (priceFor(token.address, pool.chain) || 0) * parseFloat(token.balance)
    )
  )

  clone.dynamicData.totalShares = formatUnits(totalSupply || 0n, BPT_DECIMALS)
  return clone
}
